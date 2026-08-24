from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter(prefix="/ws", tags=["Real-time WebSockets"])

class ConnectionManager:
    """Manages active WebSocket connections for live queue & status updates."""
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room: str, websocket: WebSocket):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)

    def disconnect(self, room: str, websocket: WebSocket):
        if room in self.active_connections:
            self.active_connections[room].remove(websocket)

    async def broadcast_to_room(self, room: str, message: dict):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                await connection.send_json(message)

manager = ConnectionManager()

@router.websocket("/farmer/{farmer_id}")
async def websocket_farmer_endpoint(websocket: WebSocket, farmer_id: str):
    room = f"farmer_{farmer_id}"
    await manager.connect(room, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming socket messages
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)

@router.websocket("/centre/{centre_id}")
async def websocket_centre_endpoint(websocket: WebSocket, centre_id: str):
    room = f"centre_{centre_id}"
    await manager.connect(room, websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(room, websocket)
