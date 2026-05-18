import os
import sys
import json
import uuid
import asyncio
import logging
from pathlib import Path
from typing import Any

from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from agents.orchestrator import run_pipeline

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="VIGILO - EU AI Act Compliance Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("/tmp/vigilo_uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".rs", ".cpp", ".c", ".cs", ".zip"}


class ConnectionManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.connections:
            self.connections[session_id] = []
        self.connections[session_id].append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket):
        if session_id in self.connections:
            self.connections[session_id].remove(websocket)
            if not self.connections[session_id]:
                del self.connections[session_id]

    async def broadcast(self, session_id: str, message: dict[str, Any]):
        if session_id not in self.connections:
            return
        payload = json.dumps(message)
        stale = []
        for ws in self.connections[session_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.disconnect(session_id, ws)


manager = ConnectionManager()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "vigilo"}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower() if file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {ext}. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    session_id = str(uuid.uuid4())
    safe_name = f"{session_id}{ext}"
    file_path = UPLOAD_DIR / safe_name

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    asyncio.create_task(
        run_pipeline(str(file_path), file.filename, session_id, manager)
    )

    return JSONResponse({
        "session_id": session_id,
        "filename": file.filename,
        "size": len(content),
        "status": "processing",
    })


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(session_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(session_id, websocket)


@app.post("/voice")
async def voice_transcribe(file: UploadFile = File(...)):
    api_key = os.getenv("SPEECHMATICS_API_KEY", "")
    if not api_key or api_key == "your-speechmatics-api-key":
        logger.warning("No valid SPEECHMATICS_API_KEY, returning mock transcription")
        content = await file.read()
        return JSONResponse({
            "transcript": "This is a mock transcription of the uploaded audio. Our AI system uses machine learning to screen job candidates based on their CV and interview responses.",
            "confidence": 0.92,
            "duration_seconds": len(content) / 16000 if len(content) > 0 else 0,
        })

    try:
        import httpx

        content = await file.read()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.speechmatics.com/v2/jobs",
                headers={"Authorization": f"Bearer {api_key}"},
                files={"data_file": (file.filename or "audio.wav", content, file.content_type or "audio/wav")},
                data={"config": json.dumps({"type": "transcription", "language": "en"})},
                timeout=60,
            )
            result = response.json()

            return JSONResponse({
                "transcript": result.get("results", [{}])[0].get("alternatives", [{}])[0].get("transcript", "")
                           if "results" in result else result.get("text", ""),
                "confidence": result.get("confidence", 0),
                "duration_seconds": result.get("duration", 0),
            })
    except Exception as e:
        logger.error(f"Speechmatics transcription failed: {e}")
        return JSONResponse({
            "transcript": "Speechmatics transcription failed. Using fallback text.",
            "confidence": 0,
            "duration_seconds": 0,
        })
