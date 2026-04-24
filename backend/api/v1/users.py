from fastapi import APIRouter
router = APIRouter(prefix="/api/v1/users", tags=["users"])
@router.get("/")
async def get_users(): return []
