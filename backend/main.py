from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import asyncio
import json
import random
import uuid
from datetime import datetime
import logging
import socketio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BB84 QKD Demo API", version="1.0.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class BB84Simulation(BaseModel):
    n_bits: int = 20
    eve_prob: float = 0.2

class UserData(BaseModel):
    user_id: str
    user_type: str  # 'alice', 'bob', 'eve'
    bits: Optional[List[int]] = None
    bases: Optional[List[int]] = None
    measurements: Optional[List[int]] = None
    sifted_key: Optional[List[int]] = None
    final_key: Optional[List[int]] = None

class Message(BaseModel):
    sender: str
    content: str
    encrypted: bool = False
    timestamp: datetime

# Global state management
class BB84Session:
    def __init__(self):
        self.session_id = str(uuid.uuid4())
        self.alice_data = UserData(user_id="alice", user_type="alice")
        self.bob_data = UserData(user_id="bob", user_type="bob")
        self.eve_data = UserData(user_id="eve", user_type="eve")
        self.phase = "idle"  # idle, photon_transmission, basis_comparison, key_generation, messaging
        self.qber = 0.0
        self.connected_users = {}
        self.messages = []
        
    def reset(self):
        self.alice_data = UserData(user_id="alice", user_type="alice")
        self.bob_data = UserData(user_id="bob", user_type="bob")
        self.eve_data = UserData(user_id="eve", user_type="eve")
        self.phase = "idle"
        self.qber = 0.0
        self.messages = []

# Global session
session = BB84Session()

# Socket.IO server
sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode='asyncio')
app.mount("/socket.io", socketio.ASGIApp(sio))

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Any] = {}

    async def connect(self, sid: str, user_id: str):
        self.active_connections[user_id] = sid
        session.connected_users[user_id] = True
        logger.info(f"User {user_id} connected with sid {sid}")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in session.connected_users:
            del session.connected_users[user_id]
        logger.info(f"User {user_id} disconnected")

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await sio.emit('message', message, room=self.active_connections[user_id])

    async def broadcast(self, message: str, exclude_user: Optional[str] = None):
        for user_id, sid in self.active_connections.items():
            if exclude_user and user_id == exclude_user:
                continue
            try:
                await sio.emit('message', message, room=sid)
            except:
                # Connection might be closed
                pass

manager = ConnectionManager()

@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")
    # Find and remove user from active connections
    for user_id, user_sid in manager.active_connections.items():
        if user_sid == sid:
            manager.disconnect(user_id)
            break

@sio.event
async def join(sid, data):
    user_id = data.get('user_id')
    if user_id:
        await manager.connect(sid, user_id)
        await sio.emit('joined', {'user_id': user_id}, room=sid)

@sio.event
async def message(sid, data):
    # Handle incoming messages from clients
    message_data = json.loads(data) if isinstance(data, str) else data
    
    # Find user_id for this sid
    user_id = None
    for uid, user_sid in manager.active_connections.items():
        if user_sid == sid:
            user_id = uid
            break
    
    if not user_id:
        return
    
    # Handle different message types
    if message_data["type"] == "alice_send_photons":
        await handle_alice_send_photons(message_data["data"])
    elif message_data["type"] == "eve_intercept":
        await handle_eve_intercept(message_data["data"])
    elif message_data["type"] == "basis_comparison":
        await handle_basis_comparison(message_data["data"])
    elif message_data["type"] == "send_message":
        await handle_send_message(message_data["data"])
    elif message_data["type"] == "session_reset":
        session.reset()
        await manager.broadcast(json.dumps({
            "type": "session_reset",
            "data": {"phase": "idle"}
        }))

# BB84 Protocol Implementation
class BB84Protocol:
    @staticmethod
    def generate_random_bits(n: int) -> List[int]:
        """Generate random bits (0 or 1)"""
        return [random.randint(0, 1) for _ in range(n)]
    
    @staticmethod
    def generate_random_bases(n: int) -> List[int]:
        """Generate random bases (0 for rectilinear, 1 for diagonal)"""
        return [random.randint(0, 1) for _ in range(n)]
    
    @staticmethod
    def encode_photons(bits: List[int], bases: List[int]) -> List[int]:
        """Encode bits using BB84 bases"""
        photons = []
        for bit, base in zip(bits, bases):
            if base == 0:  # Rectilinear basis
                photons.append(bit)  # 0 -> |0⟩, 1 -> |1⟩
            else:  # Diagonal basis
                photons.append(bit + 2)  # 0 -> |+⟩, 1 -> |-⟩
        return photons
    
    @staticmethod
    def measure_photons(photons: List[int], measurement_bases: List[int]) -> List[int]:
        """Measure photons with given bases"""
        results = []
        for photon, base in zip(photons, measurement_bases):
            if base == 0:  # Rectilinear measurement
                if photon in [0, 1]:  # Correct basis
                    results.append(photon)
                else:  # Wrong basis - random result
                    results.append(random.randint(0, 1))
            else:  # Diagonal measurement
                if photon in [2, 3]:  # Correct basis
                    results.append(photon - 2)
                else:  # Wrong basis - random result
                    results.append(random.randint(0, 1))
        return results
    
    @staticmethod
    def simulate_eve_interception(photons: List[int], eve_prob: float) -> List[int]:
        """Simulate Eve's intercept-resend attack"""
        intercepted_photons = []
        for photon in photons:
            if random.random() < eve_prob:
                # Eve intercepts and measures with random basis
                eve_basis = random.randint(0, 1)
                if eve_basis == 0:  # Rectilinear
                    if photon in [0, 1]:
                        measured_bit = photon
                    else:
                        measured_bit = random.randint(0, 1)
                else:  # Diagonal
                    if photon in [2, 3]:
                        measured_bit = photon - 2
                    else:
                        measured_bit = random.randint(0, 1)
                
                # Eve resends with random basis
                resend_basis = random.randint(0, 1)
                if resend_basis == 0:
                    intercepted_photons.append(measured_bit)
                else:
                    intercepted_photons.append(measured_bit + 2)
            else:
                intercepted_photons.append(photon)
        return intercepted_photons
    
    @staticmethod
    def calculate_qber(alice_bits: List[int], bob_bits: List[int], matched_indices: List[int]) -> float:
        """Calculate Quantum Bit Error Rate"""
        if not matched_indices:
            return 0.0
        
        errors = 0
        for idx in matched_indices:
            if alice_bits[idx] != bob_bits[idx]:
                errors += 1
        
        return errors / len(matched_indices) if matched_indices else 0.0
    
    @staticmethod
    def error_correction(sifted_key: List[int], qber: float) -> List[int]:
        """Simple error correction based on QBER"""
        if qber < 0.1:  # Low error rate - keep most bits
            return sifted_key
        elif qber < 0.3:  # Medium error rate - remove some bits
            return sifted_key[::2]  # Take every other bit
        else:  # High error rate - significant reduction
            return sifted_key[::3]  # Take every third bit

# API Endpoints
@app.get("/")
async def root():
    return {"message": "BB84 QKD Demo API", "session_id": session.session_id}

@app.get("/simulate")
async def simulate_bb84(n_bits: int = 20, eve_prob: float = 0.2):
    """Simulate BB84 protocol"""
    try:
        # Generate Alice's data
        alice_bits = BB84Protocol.generate_random_bits(n_bits)
        alice_bases = BB84Protocol.generate_random_bases(n_bits)
        alice_photons = BB84Protocol.encode_photons(alice_bits, alice_bases)
        
        # Simulate Eve's interception
        intercepted_photons = BB84Protocol.simulate_eve_interception(alice_photons, eve_prob)
        
        # Generate Bob's measurement bases
        bob_bases = BB84Protocol.generate_random_bases(n_bits)
        bob_measurements = BB84Protocol.measure_photons(intercepted_photons, bob_bases)
        
        # Find matching bases
        matched_indices = [i for i in range(n_bits) if alice_bases[i] == bob_bases[i]]
        
        # Generate sifted keys
        alice_sifted = [alice_bits[i] for i in matched_indices]
        bob_sifted = [bob_measurements[i] for i in matched_indices]
        
        # Calculate QBER
        qber = BB84Protocol.calculate_qber(alice_bits, bob_measurements, matched_indices)
        
        # Error correction
        final_key = BB84Protocol.error_correction(alice_sifted, qber)
        
        return {
            "alice_bits": alice_bits,
            "alice_bases": alice_bases,
            "bob_bases": bob_bases,
            "bob_measurements": bob_measurements,
            "matched_indices": matched_indices,
            "alice_sifted": alice_sifted,
            "bob_sifted": bob_sifted,
            "qber": qber,
            "final_key": final_key,
            "eve_intercepted": eve_prob > 0
        }
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/session/status")
async def get_session_status():
    """Get current session status"""
    return {
        "session_id": session.session_id,
        "phase": session.phase,
        "qber": session.qber,
        "connected_users": list(session.connected_users.keys()),
        "alice_data": session.alice_data.dict(),
        "bob_data": session.bob_data.dict(),
        "eve_data": session.eve_data.dict()
    }

@app.post("/session/reset")
async def reset_session():
    """Reset the current session"""
    session.reset()
    await manager.broadcast(json.dumps({
        "type": "session_reset",
        "data": {"phase": "idle"}
    }))
    return {"message": "Session reset successfully"}

@app.post("/message")
async def send_message(message: Message):
    """Send a message in the session"""
    session.messages.append(message)
    await manager.broadcast(json.dumps({
        "type": "new_message",
        "data": message.dict()
    }))
    return {"message": "Message sent successfully"}

@app.get("/messages")
async def get_messages():
    """Get all messages in the session"""
    return {"messages": [msg.dict() for msg in session.messages]}

# WebSocket endpoint (legacy - kept for compatibility)
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    await websocket.send_text(json.dumps({"type": "connected", "user_id": user_id}))

async def handle_alice_send_photons(data):
    """Handle Alice sending photons"""
    session.phase = "photon_transmission"
    session.alice_data.bits = data["bits"]
    session.alice_data.bases = data["bases"]
    
    # Simulate photon transmission with Eve interception
    photons = BB84Protocol.encode_photons(data["bits"], data["bases"])
    intercepted_photons = BB84Protocol.simulate_eve_interception(photons, data.get("eve_prob", 0.2))
    
    # Send to Bob
    await manager.broadcast(json.dumps({
        "type": "photons_received",
        "data": {
            "photons": intercepted_photons,
            "phase": "photon_transmission"
        }
    }), exclude_user="alice")

async def handle_eve_intercept(data):
    """Handle Eve's interception"""
    session.eve_data.bits = data.get("bits")
    session.eve_data.bases = data.get("bases")
    
    await manager.broadcast(json.dumps({
        "type": "eve_intercepted",
        "data": data
    }))

async def handle_basis_comparison(data):
    """Handle basis comparison phase"""
    session.phase = "basis_comparison"
    session.bob_data.bases = data["bob_bases"]
    session.bob_data.measurements = data["bob_measurements"]
    
    # Find matching bases
    matched_indices = [i for i in range(len(session.alice_data.bases)) 
                      if session.alice_data.bases[i] == session.bob_data.bases[i]]
    
    # Calculate QBER
    qber = BB84Protocol.calculate_qber(
        session.alice_data.bits, 
        session.bob_data.measurements, 
        matched_indices
    )
    session.qber = qber
    
    # Generate sifted keys
    session.alice_data.sifted_key = [session.alice_data.bits[i] for i in matched_indices]
    session.bob_data.sifted_key = [session.bob_data.measurements[i] for i in matched_indices]
    
    # Error correction
    final_key = BB84Protocol.error_correction(session.alice_data.sifted_key, qber)
    session.alice_data.final_key = final_key
    session.bob_data.final_key = final_key
    
    await manager.broadcast(json.dumps({
        "type": "basis_comparison_complete",
        "data": {
            "matched_indices": matched_indices,
            "qber": qber,
            "sifted_key": session.alice_data.sifted_key,
            "final_key": final_key,
            "phase": "key_generation"
        }
    }))

async def handle_send_message(data):
    """Handle sending encrypted message"""
    message = Message(
        sender=data["sender"],
        content=data["content"],
        encrypted=data.get("encrypted", False),
        timestamp=datetime.now()
    )
    session.messages.append(message)
    
    await manager.broadcast(json.dumps({
        "type": "new_message",
        "data": message.dict()
    }))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
