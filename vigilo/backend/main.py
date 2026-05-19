import os
import uuid
import asyncio
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import aiofiles

from agents.orchestrator import run_pipeline

load_dotenv()

app = FastAPI(title="VIGILO API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active websockets
active_sessions = {}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    session_id = str(uuid.uuid4())
    
    # Save file temporarily
    os.makedirs("tmp", exist_ok=True)
    file_path = f"tmp/{session_id}_{file.filename}"
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    is_code = file.filename.endswith(('.py', '.js', '.zip'))
    
    # We don't start the pipeline here. We start it when the WS connects,
    # or we can start it in background and the WS just attaches to the session.
    # To keep it simple, we store the file path and start pipeline on WS connect.
    active_sessions[session_id] = {
        "file_path": file_path,
        "is_code": is_code,
        "ws": None,
        "task": None
    }
    
    return {"session_id": session_id, "message": "File uploaded, connect to websocket"}

@app.post("/voice")
async def upload_voice(audio: UploadFile = File(...)):
    session_id = str(uuid.uuid4())
    
    # Mocking speechmatics for now
    os.makedirs("tmp", exist_ok=True)
    file_path = f"tmp/{session_id}_voice.txt"
    
    async with aiofiles.open(file_path, 'w') as out_file:
        await out_file.write("Voice transcript: This is an AI system that uses facial recognition for building access control.")
        
    active_sessions[session_id] = {
        "file_path": file_path,
        "is_code": False,
        "ws": None,
        "task": None
    }
    
    return {"session_id": session_id, "message": "Voice processed, connect to websocket"}


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    
    if session_id not in active_sessions:
        await websocket.close(code=1008, reason="Session not found")
        return
        
    session = active_sessions[session_id]
    session["ws"] = websocket
    
    # Start pipeline
    try:
        await run_pipeline(session_id, session["file_path"], session["is_code"], websocket)
    except WebSocketDisconnect:
        print(f"Client disconnected for session {session_id}")
    finally:
        # Cleanup
        if session_id in active_sessions:
            try:
                os.remove(session["file_path"])
            except:
                pass
            del active_sessions[session_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
