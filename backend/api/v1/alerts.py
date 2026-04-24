from fastapi import APIRouter, HTTPException, Depends
from backend.utils.generators import get_alerts, add_alert, _alerts
from backend.auth.rbac import require_permission
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])

class AckRequest(BaseModel):
    status: str

@router.get("")
async def get_alerts_route(severity: str = None, status: str = None, page: int = 1, limit: int = 50):
    alerts = get_alerts(severity, status, limit)
    return {"alerts": alerts, "total": len(_alerts), "page": page}

@router.get("/{id}")
async def get_alert(id: str):
    for a in _alerts:
        if a["id"] == id:
            return a
    raise HTTPException(status_code=404, detail="Alert not found")

@router.patch("/{id}")
async def ack_alert(id: str, req: AckRequest, user=Depends(require_permission("acknowledge"))):
    for a in _alerts:
        if a["id"] == id:
            a["status"] = req.status
            return a
    raise HTTPException(status_code=404, detail="Alert not found")

@router.post("/{id}/block")
async def block_ip(id: str, user=Depends(require_permission("write"))):
    for a in _alerts:
        if a["id"] == id:
            return {"blocked": True, "ip": a["src_ip"]}
    raise HTTPException(status_code=404, detail="Alert not found")
