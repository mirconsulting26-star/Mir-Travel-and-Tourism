from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime

from app.core.security import verify_password, create_access_token, decode_access_token
from app.core.config import settings
from app.db.mongo import get_db
from app.schemas.domain import LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Auth"])
security_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> UserResponse:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired authentication token.")
    
    email = payload["sub"]
    db = get_db()
    
    if db is not None:
        user_doc = await db.admin_users.find_one({"email": email})
        if user_doc:
            return UserResponse(
                id=str(user_doc["_id"]),
                email=user_doc["email"],
                full_name=user_doc["full_name"],
                role=user_doc.get("role", "STAFF"),
                is_active=user_doc.get("is_active", True),
                created_at=user_doc.get("created_at", datetime.utcnow().isoformat())
            )
            
    # Mock fallback for development if DB is disconnected
    if email == settings.ADMIN_BOOTSTRAP_EMAIL:
        return UserResponse(
            id="usr_admin_bootstrap",
            email=settings.ADMIN_BOOTSTRAP_EMAIL,
            full_name="MIR Admin Superuser",
            role="SUPER_ADMIN",
            is_active=True,
            created_at=datetime.utcnow().isoformat()
        )
        
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found.")

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    db = get_db()
    user_data = None
    
    if db is not None:
        user_doc = await db.admin_users.find_one({"email": req.email})
        if user_doc and verify_password(req.password, user_doc["password_hash"]):
            user_data = UserResponse(
                id=str(user_doc["_id"]),
                email=user_doc["email"],
                full_name=user_doc["full_name"],
                role=user_doc.get("role", "STAFF"),
                is_active=user_doc.get("is_active", True),
                created_at=user_doc.get("created_at", datetime.utcnow().isoformat())
            )
            
    # Bootstrap user fallback verification
    if not user_data and req.email == settings.ADMIN_BOOTSTRAP_EMAIL and req.password == settings.ADMIN_BOOTSTRAP_PASSWORD:
        user_data = UserResponse(
            id="usr_admin_bootstrap",
            email=settings.ADMIN_BOOTSTRAP_EMAIL,
            full_name="MIR Admin Superuser",
            role="SUPER_ADMIN",
            is_active=True,
            created_at=datetime.utcnow().isoformat()
        )

    if not user_data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
        
    token = create_access_token(data={"sub": user_data.email, "role": user_data.role})
    return TokenResponse(access_token=token, user=user_data)

@router.get("/me", response_model=UserResponse)
async def me(current_user: UserResponse = Depends(get_current_user)):
    return current_user
