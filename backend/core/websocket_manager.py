import json
import logging
from typing import Any

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        if session_id not in self.connections:
            self.connections[session_id] = []
        self.connections[session_id].append(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket | None = None):
        if session_id not in self.connections:
            return
        if websocket is None:
            del self.connections[session_id]
            return
        self.connections[session_id].remove(websocket)
        if not self.connections[session_id]:
            del self.connections[session_id]

    async def send_message(self, session_id: str, message: dict[str, Any]):
        websockets = self.connections.get(session_id)
        if not websockets:
            return
        payload = json.dumps(message)
        stale = []
        for ws in websockets:
            try:
                await ws.send_text(payload)
            except Exception:
                stale.append(ws)
        for ws in stale:
            self.disconnect(session_id, ws)

    async def broadcast(self, session_id: str, message: dict[str, Any]):
        await self.send_message(session_id, message)


manager = ConnectionManager()
