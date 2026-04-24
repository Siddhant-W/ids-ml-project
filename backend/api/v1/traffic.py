from fastapi import APIRouter
from backend.utils.generators import get_packets
import random

router = APIRouter(prefix="/api/v1/traffic", tags=["traffic"])

@router.get("/live")
async def live_traffic():
    return {"packets": get_packets(50)}

@router.get("/stats")
async def traffic_stats():
    pkts = get_packets(100)
    malicious = sum(1 for p in pkts if p["classification"] != "NORMAL")
    return {
        "packets_per_second": random.randint(12000, 17000),
        "malicious_count": malicious,
        "normal_count": 100 - malicious,
        "top_protocols": {"TCP":42, "UDP":28, "ICMP":15, "HTTP":10, "HTTPS":5},
        "bandwidth_in_mbps": random.randint(400, 800),
        "bandwidth_out_mbps": random.randint(300, 600),
    }
