from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from backend.auth.jwt_handler import authenticate_user, create_access_token
from backend.auth.rbac import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class LoginRequest(BaseModel):
  email: str
  password: str
  role: str = "Viewer"

@router.post("/login")
async def login(req: LoginRequest):
  user = authenticate_user(req.email, req.password)
  if not user:
    raise HTTPException(status_code=401, detail="Invalid credentials")
  token = create_access_token({"sub": user["email"], 
                                "role": user["role"],
                                "name": user["name"]})
  return {"access_token": token, "token_type": "bearer", 
          "role": user["role"], "name": user["name"]}

@router.get("/me")
async def me(user = Depends(get_current_user)):
  return user
