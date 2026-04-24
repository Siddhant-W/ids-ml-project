from fastapi import APIRouter, Depends
from backend.utils.generators import get_policies, toggle_policy, _policies
from backend.auth.rbac import require_permission
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/policy", tags=["policy"])

class PolicyCreate(BaseModel):
    name: str
    type: str
    severity: str
    condition: str
    action: str

class SimRequest(BaseModel):
    ip: str
    protocol: str
    pps: int

@router.get("")
async def get_policies_route():
    return {"policies": get_policies()}

@router.post("/{id}/toggle")
async def toggle_policy_route(id: str, user=Depends(require_permission("toggle_policy"))):
    return toggle_policy(id)

@router.post("")
async def create_policy(req: PolicyCreate, user=Depends(require_permission("write"))):
    new_pol = {
        "id": "p" + str(len(_policies) + 1),
        "name": req.name,
        "type": req.type,
        "severity": req.severity,
        "enabled": True,
        "action": req.action
    }
    _policies.insert(0, new_pol)
    return new_pol

@router.post("/simulate")
async def simulate_rule(req: SimRequest):
    hit = req.pps > 5000 or req.protocol == "ICMP"
    if hit:
        rule_name = "ICMP Flood Detection" if req.protocol == "ICMP" else "Block SYN Flood Attacks"
        return {"matched": True, "action": "BLOCK", "rule": rule_name}
    return {"matched": False, "action": "ALLOW", "rule": None}
