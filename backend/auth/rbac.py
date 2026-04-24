from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.auth.jwt_handler import decode_token

ROLE_PERMISSIONS = {
  "Admin":   ["read","write","delete","train","manage_users","settings","acknowledge","toggle_policy"],
  "Analyst": ["read","write","acknowledge","toggle_policy"],
  "Viewer":  ["read"],
}

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
  token = credentials.credentials
  payload = decode_token(token)
  if not payload:
    raise HTTPException(status_code=401, detail="Invalid token")
  return payload

def require_permission(permission: str):
  async def dependency(user = Depends(get_current_user)):
    role = user.get("role","Viewer")
    if permission not in ROLE_PERMISSIONS.get(role, []):
      raise HTTPException(status_code=403, 
        detail=f"Role '{role}' cannot perform '{permission}'")
    return user
  return dependency
