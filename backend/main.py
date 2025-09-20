# FastAPI Backend - Main Application
# Note: This is a complete backend structure that requires installation of dependencies
# In a production environment, run: pip install -r requirements.txt

from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from typing import List, Optional, Dict, Set
from collections import defaultdict
import uuid

# Database models (using Pydantic for validation)
from pydantic import BaseModel, EmailStr
from enum import Enum

# Initialize FastAPI app
app = FastAPI(
    title="TherapyConnect API",
    description="Counseling and Life-Coaching Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
# Use pbkdf2_sha256 to avoid platform-specific C extension issues with bcrypt on Windows
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic Models
class UserRole(str, Enum):
    USER = "user"
    TRAINER = "trainer"
    ADMIN = "admin"

class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"

class SessionMode(str, Enum):
    VIDEO = "video"
    AUDIO = "audio"
    CHAT = "chat"

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: UserRole

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    role: UserRole
    created_at: datetime
    updated_at: datetime

class TrainerProfile(BaseModel):
    first_name: str
    last_name: str
    phone: str
    specializations: List[str]
    certifications: List[str]
    hourly_rate: float
    bio: str
    experience: int
    is_verified: bool = False

class BookingCreate(BaseModel):
    service_id: str
    trainer_id: str
    scheduled_at: datetime
    session_mode: SessionMode
    notes: Optional[str] = None

class Booking(BaseModel):
    id: str
    user_id: str
    trainer_id: str
    service_type: str
    scheduled_at: datetime
    duration: int
    status: BookingStatus
    session_mode: SessionMode
    notes: Optional[str] = None
    created_at: datetime

class FeedbackCreate(BaseModel):
    booking_id: str
    rating: int
    review: str
    is_recommended: bool

class EmergencyRequest(BaseModel):
    booking_id: str
    reason: str
    preferred_action: str
    alternative_trainers: Optional[List[str]] = None
    new_schedule: Optional[datetime] = None

# In-memory storage (replace with actual database in production)
users_db = {}
trainers_db = {}
bookings_db = {}
feedback_db = {}

# Utility Functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = users_db.get(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# WebSocket Manager for real-time notifications
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, Set[str]] = defaultdict(set)
        self.connection_users: Dict[str, str] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        return client_id

    def disconnect(self, websocket: WebSocket):
        if websocket in self.connection_users:
            client_id = self.connection_users[websocket]
            if client_id in self.active_connections:
                del self.active_connections[client_id]
            if client_id in self.connection_users:
                del self.connection_users[websocket]
            # Remove from user_connections
            for user_id, connections in self.user_connections.items():
                if client_id in connections:
                    connections.remove(client_id)

    async def subscribe_user(self, client_id: str, user_id: str):
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(client_id)
        self.connection_users[client_id] = user_id

    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.user_connections:
            for client_id in list(self.user_connections[user_id]):
                if client_id in self.active_connections:
                    try:
                        await self.active_connections[client_id].send_json(message)
                    except Exception as e:
                        print(f"Error sending to client {client_id}: {e}")
                        self.disconnect(self.active_connections[client_id])

    async def broadcast(self, message: dict, user_ids: List[str] = None):
        """
        Send message to specific users or all connected users
        """
        if user_ids:
            for user_id in user_ids:
                await self.send_to_user(user_id, message)
        else:
            for client_id in list(self.active_connections.keys()):
                try:
                    await self.active_connections[client_id].send_json(message)
                except Exception as e:
                    print(f"Error broadcasting to {client_id}: {e}")
                    self.disconnect(self.active_connections[client_id])

manager = ConnectionManager()

# API Routes

# Health Check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Authentication Routes
@app.post("/api/v1/auth/register")
async def register(user_data: UserCreate):
    if user_data.email in [u.get("email") for u in users_db.values()]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user_data.password)
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "password": hashed_password,
        "role": user_data.role,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    users_db[user_id] = user
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    return {
        "user": User(**{k: v for k, v in user.items() if k != "password"}),
        "token": access_token,
        "token_type": "bearer"
    }

@app.post("/api/v1/auth/login")
async def login(login_data: UserLogin):
    user = next((u for u in users_db.values() if u["email"] == login_data.email), None)
    
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    return {
        "user": User(**{k: v for k, v in user.items() if k != "password"}),
        "token": access_token,
        "token_type": "bearer"
    }

@app.get("/api/v1/auth/me")
async def get_current_user_info(current_user=Depends(get_current_user)):
    return User(**{k: v for k, v in current_user.items() if k != "password"})

# Trainer Routes
@app.post("/api/v1/trainers/onboard")
async def onboard_trainer(
    trainer_profile: TrainerProfile, 
    current_user=Depends(get_current_user)
):
    if current_user["role"] != UserRole.TRAINER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only trainers can access this endpoint"
        )
    
    trainer_data = trainer_profile.dict()
    trainer_data["user_id"] = current_user["id"]
    trainer_data["id"] = str(uuid.uuid4())
    trainer_data["created_at"] = datetime.utcnow()
    trainer_data["rating"] = 0.0
    trainer_data["review_count"] = 0
    
    trainers_db[trainer_data["id"]] = trainer_data
    
    return {"message": "Trainer profile created successfully", "trainer_id": trainer_data["id"]}

@app.get("/api/v1/trainers/list")
async def list_trainers(skip: int = 0, limit: int = 10):
    trainers = list(trainers_db.values())[skip: skip + limit]
    return {"trainers": trainers, "total": len(trainers_db)}

@app.get("/api/v1/trainers/{trainer_id}")
async def get_trainer(trainer_id: str):
    trainer = trainers_db.get(trainer_id)
    if not trainer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trainer not found"
        )
    return trainer

# Booking Routes
@app.post("/api/v1/bookings/create")
async def create_booking(
    booking_data: BookingCreate,
    current_user=Depends(get_current_user)
):
    booking_id = str(uuid.uuid4())
    
    booking = {
        "id": booking_id,
        "user_id": current_user["id"],
        "trainer_id": booking_data.trainer_id,
        "service_type": booking_data.service_id,
        "scheduled_at": booking_data.scheduled_at,
        "duration": 50,  # Default duration
        "status": BookingStatus.PENDING,
        "session_mode": booking_data.session_mode,
        "notes": booking_data.notes,
        "created_at": datetime.utcnow()
    }
    
    bookings_db[booking_id] = booking
    
    # Send notification to trainer (WebSocket)
    await manager.broadcast(f"New booking request: {booking_id}")
    
    return Booking(**booking)

@app.get("/api/v1/bookings/list")
async def list_bookings(current_user=Depends(get_current_user)):
    user_bookings = [
        b for b in bookings_db.values() 
        if b["user_id"] == current_user["id"]
    ]
    return {"bookings": user_bookings}

# Feedback Routes
@app.post("/api/v1/feedback/submit")
async def submit_feedback(
    feedback_data: FeedbackCreate,
    current_user=Depends(get_current_user)
):
    # Verify booking belongs to user
    booking = bookings_db.get(feedback_data.booking_id)
    if not booking or booking["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot submit feedback for this booking"
        )
    
    feedback_id = str(uuid.uuid4())
    feedback = {
        "id": feedback_id,
        "booking_id": feedback_data.booking_id,
        "user_id": current_user["id"],
        "rating": feedback_data.rating,
        "review": feedback_data.review,
        "is_recommended": feedback_data.is_recommended,
        "created_at": datetime.utcnow()
    }
    
    feedback_db[feedback_id] = feedback
    
    return {"message": "Feedback submitted successfully", "feedback_id": feedback_id}

# Emergency Routes
@app.post("/api/v1/emergency/notify")
async def emergency_notify(
    emergency_data: EmergencyRequest,
    current_user=Depends(get_current_user)
):
    # Verify booking belongs to user
    booking = bookings_db.get(emergency_data.booking_id)
    if not booking or booking["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create emergency request for this booking"
        )
    
    # Process emergency request based on preferred action
    if emergency_data.preferred_action == "switch":
        # Find alternative trainers
        alternative_trainers = list(trainers_db.keys())[:3]
        return {
            "message": "Emergency request processed",
            "alternative_trainers": alternative_trainers
        }
    elif emergency_data.preferred_action == "reschedule":
        # Update booking status
        booking["status"] = BookingStatus.RESCHEDULED
        return {"message": "Booking rescheduled successfully"}
    
    return {"message": "Emergency request processed"}

# AI Recommendations (Mock Implementation)
@app.get("/api/v1/ai/recommendations")
async def get_recommendations(current_user=Depends(get_current_user)):
    # Mock AI recommendations based on user history
    recommended_trainers = list(trainers_db.values())[:3]
    return {
        "recommendations": [
            {
                "type": "trainer",
                "item": trainer,
                "score": 0.95,
                "reason": "Matches your previous session preferences"
            }
            for trainer in recommended_trainers
        ]
    }

# Loyalty Program Routes
@app.get("/api/v1/loyalty/points")
async def get_loyalty_points(current_user=Depends(get_current_user)):
    # Mock loyalty points calculation
    user_bookings = len([b for b in bookings_db.values() if b["user_id"] == current_user["id"]])
    points = user_bookings * 10  # 10 points per session
    return {
        "points": points,
        "tier": "gold" if points > 100 else "silver" if points > 50 else "bronze",
        "benefits_available": ["priority_booking", "discount_10"]
    }

# WebSocket for real-time notifications
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    client_id = str(uuid.uuid4())
    user_id = None
    
    # Authenticate if token is provided
    if token:
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
        except JWTError:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    
    # Connect the WebSocket
    await manager.connect(websocket, client_id)
    
    # Subscribe to user's channel if authenticated
    if user_id:
        await manager.subscribe_user(client_id, user_id)
        print(f"User {user_id} connected with client_id {client_id}")
    
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get('type')
            
            # Handle different message types
            if message_type == 'ping':
                await websocket.send_json({'type': 'pong'})
                
            elif message_type == 'subscribe':
                # Handle channel subscriptions if needed
                pass
                
            elif message_type == 'send_notification':
                notification_data = data.get('data', {})
                target_user_id = notification_data.get('userId')
                
                # Create notification object
                notification = {
                    'id': notification_data.get('id', str(uuid.uuid4())),
                    'type': notification_data.get('type', 'info'),
                    'title': notification_data.get('title', 'New Notification'),
                    'message': notification_data.get('message', ''),
                    'timestamp': datetime.utcnow().isoformat(),
                    'metadata': notification_data.get('metadata', {})
                }
                
                # Send to specific user or broadcast to all
                if target_user_id:
                    await manager.send_to_user(
                        target_user_id,
                        {'type': 'notification', 'data': notification}
                    )
                else:
                    await manager.broadcast(
                        {'type': 'notification', 'data': notification}
                    )
                
    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )