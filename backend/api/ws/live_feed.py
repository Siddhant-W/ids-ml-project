from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, random
from backend.utils.generators import generate_alert, generate_packet, generate_real_alert, SRC_IPS
import datetime

router = APIRouter()
connected_alert_clients: set = set()
connected_traffic_clients: set = set()

def _normalize_alert(alert: dict) -> dict:
    return {
        "id": alert.get("id"),
        "timestamp": alert.get("timestamp"),
        "source_ip": alert.get("source_ip") or alert.get("src_ip"),
        "attack_type": alert.get("attack_type") or alert.get("type"),
        "severity": alert.get("severity"),
        "status": alert.get("status"),
    }

@router.websocket("/ws/alerts")
async def alerts_ws(websocket: WebSocket):
    await websocket.accept()
    connected_alert_clients.add(websocket)
    row_index = 0
    try:
        while True:
            if random.random() < 0.4:
                # 30% real-ish alert schema, 70% existing mock generation
                if random.random() < 0.3:
                    prediction = random.choice(["Normal", "DoS", "Probe", "R2L", "U2R"])
                    source_ip = random.choice(SRC_IPS + [f"172.16.0.{random.randint(1,254)}"])
                    alert = generate_real_alert(prediction, source_ip, row_index)
                    row_index += 1
                else:
                    alert = generate_alert()

                await websocket.send_json(_normalize_alert(alert))
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        connected_alert_clients.discard(websocket)

@router.websocket("/ws/traffic")
async def traffic_ws(websocket: WebSocket):
    await websocket.accept()
    connected_traffic_clients.add(websocket)
    try:
        while True:
            stats = {
                "type": "stats",
                "packets_per_second": random.randint(12000, 17000),
                "malicious_pct": round(random.uniform(5, 15), 1),
                "timestamp": datetime.datetime.now().isoformat()
            }
            await websocket.send_json(stats)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        connected_traffic_clients.discard(websocket)
