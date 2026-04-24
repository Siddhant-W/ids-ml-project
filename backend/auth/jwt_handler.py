from jose import jwt, JWTError
from fastapi import HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from backend.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def hash_password(plain):
    return pwd_context.hash(plain)

DEMO_USERS = {
  "admin@aegis.sec":   {"password": hash_password("password"), "role": "Admin", "name": "Admin User"},
  "analyst@aegis.sec": {"password": hash_password("password"), "role": "Analyst", "name": "Sarah Chen"},
  "viewer@aegis.sec":  {"password": hash_password("password"), "role": "Viewer", "name": "Viewer Demo"},
}

failed_attempts = {}

def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None

def authenticate_user(email, password) -> dict | None:
  if failed_attempts.get(email, 0) >= 3:
    raise HTTPException(status_code=423, detail="Account locked after 3 failed attempts")

  user = DEMO_USERS.get(email)
  if not user or not verify_password(password, user["password"]):
    failed_attempts[email] = failed_attempts.get(email, 0) + 1
    return None

  failed_attempts[email] = 0
  return {"email": email, "role": user["role"], "name": user["name"]}
