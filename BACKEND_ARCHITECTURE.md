# AEGIS IDS — Backend Architecture & API Reference

## Stack Recommendation

| Layer | Technology | Rationale |
|---|---|---|
| API Server | FastAPI (Python) | Native ML ecosystem, async support |
| Real-time | WebSockets via FastAPI | Live packet feed to frontend |
| ML Runtime | scikit-learn + joblib | Random Forest, Decision Tree, SVM |
| Task Queue | Celery + Redis | Async model training |
| Primary DB | PostgreSQL | Alerts, users, policies |
| Time-series | InfluxDB | Packet metrics, traffic rates |
| Cache | Redis | Sessions, rate limiting, live feed buffer |
| Message Bus | Apache Kafka | High-throughput packet stream ingestion |
| Packet Capture | Scapy / libpcap / Zeek | Network interface reading |
| Auth | JWT (RS256) + bcrypt | Stateless auth with RBAC |

---

## Directory Structure

```
aegis-ids/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Settings (env-based)
│   ├── auth/
│   │   ├── jwt_handler.py
│   │   ├── rbac.py              # Role enforcement
│   │   └── models.py
│   ├── api/
│   │   ├── v1/
│   │   │   ├── alerts.py
│   │   │   ├── traffic.py
│   │   │   ├── policy.py
│   │   │   ├── ml_engine.py
│   │   │   ├── reports.py
│   │   │   └── users.py
│   │   └── ws/
│   │       └── live_feed.py     # WebSocket endpoint
│   ├── ml/
│   │   ├── classifier.py        # Model inference
│   │   ├── trainer.py           # Training pipeline
│   │   ├── preprocessor.py      # Feature extraction
│   │   └── models/              # Saved .pkl models
│   ├── capture/
│   │   ├── sniffer.py           # Packet capture (Scapy)
│   │   └── feature_extractor.py
│   ├── db/
│   │   ├── postgres.py          # SQLAlchemy models
│   │   ├── influx.py            # InfluxDB client
│   │   └── migrations/
│   ├── services/
│   │   ├── alert_service.py
│   │   ├── policy_engine.py
│   │   └── notification.py      # Email, Slack, Syslog
│   └── tasks/
│       └── celery_tasks.py      # Background training
├── frontend/
│   └── index.html               # (your single-file app)
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

---

## Core API Endpoints

### Authentication
```
POST   /api/v1/auth/login          Login → JWT tokens
POST   /api/v1/auth/refresh        Refresh access token
POST   /api/v1/auth/logout         Invalidate refresh token
```

### Alerts
```
GET    /api/v1/alerts              List alerts (paginated, filterable)
GET    /api/v1/alerts/{id}         Alert detail
PATCH  /api/v1/alerts/{id}         Acknowledge / update status
POST   /api/v1/alerts/{id}/block   Block source IP
DELETE /api/v1/alerts/{id}         Admin only — delete alert
```

### Traffic
```
GET    /api/v1/traffic/live        Recent packet snapshot
GET    /api/v1/traffic/stats       Aggregated metrics
GET    /api/v1/traffic/top-talkers Top source IPs by volume
WS     /ws/traffic                 WebSocket: live packet stream
WS     /ws/alerts                  WebSocket: live alert stream
```

### ML Engine
```
GET    /api/v1/ml/models           List all models + status
POST   /api/v1/ml/train            Trigger training (Admin only)
GET    /api/v1/ml/train/{job_id}   Training progress
POST   /api/v1/ml/predict          Single packet classification
GET    /api/v1/ml/metrics          Accuracy, precision, recall, F1
GET    /api/v1/ml/features         Feature importance
```

### Policy
```
GET    /api/v1/policy              List all rules
POST   /api/v1/policy              Create rule (Admin only)
PUT    /api/v1/policy/{id}         Update rule
DELETE /api/v1/policy/{id}         Delete rule (Admin only)
POST   /api/v1/policy/{id}/toggle  Enable / disable
POST   /api/v1/policy/simulate     Rule match simulation
```

### Reports
```
GET    /api/v1/reports/summary     30-day incident summary
GET    /api/v1/reports/export      CSV/PDF export
GET    /api/v1/reports/trends      Attack trend data
```

### Users (Admin only)
```
GET    /api/v1/users               List users
POST   /api/v1/users               Create user
PUT    /api/v1/users/{id}          Update user / role
DELETE /api/v1/users/{id}          Delete user
```

---

## Key Code Snippets

### JWT + RBAC Middleware (Python/FastAPI)
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
import jwt

ROLES = {
    "Admin":   ["read", "write", "delete", "train", "manage_users"],
    "Analyst": ["read", "write"],
    "Viewer":  ["read"],
}

def require_permission(permission: str):
    def dependency(token_data = Depends(verify_jwt)):
        role = token_data["role"]
        if permission not in ROLES.get(role, []):
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return token_data
    return dependency

# Usage in route:
@router.post("/policy")
async def create_policy(
    policy: PolicyCreate,
    user = Depends(require_permission("write"))
):
    ...
```

### WebSocket Live Feed
```python
from fastapi import WebSocket
import asyncio, json

@router.websocket("/ws/alerts")
async def alert_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            alert = await alert_queue.get()  # Redis pub/sub
            await websocket.send_json(alert)
            await asyncio.sleep(0.1)
    except Exception:
        await websocket.close()
```

### ML Classification Pipeline
```python
import joblib, numpy as np
from sklearn.ensemble import RandomForestClassifier

class IDSClassifier:
    def __init__(self):
        self.model = joblib.load("models/random_forest.pkl")
        self.scaler = joblib.load("models/scaler.pkl")
        self.label_map = {0:"NORMAL",1:"DoS",2:"Probe",3:"R2L",4:"U2R"}

    def predict(self, features: dict) -> dict:
        X = self._extract_features(features)
        X_scaled = self.scaler.transform([X])
        pred = self.model.predict(X_scaled)[0]
        proba = self.model.predict_proba(X_scaled)[0]
        return {
            "class": self.label_map[pred],
            "confidence": float(max(proba)),
            "is_attack": pred != 0
        }
```

### Training Pipeline (Celery Task)
```python
@celery.task(bind=True)
def train_model(self, dataset_path: str, algorithm: str, split: float):
    self.update_state(state="PROGRESS", meta={"progress": 5})

    df = pd.read_csv(dataset_path)
    X, y = preprocess(df)  # label encode, scale
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=1-split)

    self.update_state(state="PROGRESS", meta={"progress": 40})

    model = RandomForestClassifier(n_estimators=100, n_jobs=-1)
    model.fit(X_train, y_train)

    self.update_state(state="PROGRESS", meta={"progress": 80})

    metrics = evaluate(model, X_test, y_test)
    joblib.dump(model, "models/random_forest.pkl")

    self.update_state(state="SUCCESS", meta={"progress": 100, "metrics": metrics})
    return metrics
```

### Packet Capture + Classify
```python
from scapy.all import sniff, IP, TCP, UDP

classifier = IDSClassifier()

def process_packet(pkt):
    if IP not in pkt:
        return
    features = extract_features(pkt)    # duration, src_bytes, etc.
    result = classifier.predict(features)

    if result["is_attack"]:
        alert = create_alert(pkt, result)
        publish_to_kafka("alerts", alert)   # real-time stream
        store_alert_postgres(alert)
        if result["class"] in ["DoS","U2R"]:
            apply_policy(pkt[IP].src, "BLOCK")

sniff(iface="eth0", prn=process_packet, store=False)
```

---

## Database Schema (PostgreSQL)

```sql
-- Users & RBAC
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('Admin','Analyst','Viewer')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- Alerts
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,              -- ALT-XXXXX
  timestamp TIMESTAMPTZ DEFAULT now(),
  severity TEXT NOT NULL,
  attack_type TEXT NOT NULL,
  src_ip INET,
  dst_ip INET,
  protocol TEXT,
  status TEXT DEFAULT 'DETECTED',
  ml_confidence FLOAT,
  acknowledged_by UUID REFERENCES users(id),
  acknowledged_at TIMESTAMPTZ
);

-- Policies
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT,                        -- FIREWALL, IDS, IPS, WAF, ML
  severity TEXT,
  condition TEXT,                   -- e.g. "pps > 5000 AND proto = TCP"
  action TEXT,                      -- BLOCK, ALERT, LOG
  is_enabled BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ML Model Registry
CREATE TABLE ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  dataset TEXT,
  accuracy FLOAT,
  precision_score FLOAT,
  recall_score FLOAT,
  f1_score FLOAT,
  is_active BOOLEAN DEFAULT false,
  trained_at TIMESTAMPTZ DEFAULT now(),
  model_path TEXT
);

-- Indices for performance
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_src_ip ON alerts(src_ip);
```

---

## Docker Compose

```yaml
version: "3.9"
services:
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://ids:ids@postgres/aegis
      - REDIS_URL=redis://redis:6379
      - KAFKA_BOOTSTRAP=kafka:9092
      - JWT_SECRET=${JWT_SECRET}
    depends_on: [postgres, redis, kafka]

  worker:
    build: .
    command: celery -A tasks worker --loglevel=info
    depends_on: [redis, postgres]

  postgres:
    image: postgres:16-alpine
    environment: {POSTGRES_USER: ids, POSTGRES_PASSWORD: ids, POSTGRES_DB: aegis}
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

  influxdb:
    image: influxdb:2.7
    ports: ["8086:8086"]

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181

  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0

volumes:
  pgdata:
```

---

## Security Checklist

- [ ] JWT RS256 signing (not HS256 — asymmetric for microservices)
- [ ] HTTPS only (TLS 1.3 via nginx reverse proxy)
- [ ] Rate limiting on auth endpoints (5 req/min per IP)
- [ ] Bcrypt password hashing (cost factor ≥ 12)
- [ ] SQL parameterized queries / ORM only — no raw string interpolation
- [ ] Role enforcement on every route via dependency injection
- [ ] Audit log table for all Admin actions
- [ ] CORS whitelist (frontend origin only)
- [ ] Secrets via environment variables, never in code
- [ ] Input validation with Pydantic models on all API inputs
- [ ] Packet capture runs as minimal-privilege user (CAP_NET_RAW only)
- [ ] ML model files checksummed — detect tampering before loading

---

## Scalability Notes

- **Horizontal API scaling**: Stateless JWT → multiple FastAPI pods behind nginx
- **Kafka partitioning**: Partition by src_ip hash for ordered per-IP processing
- **InfluxDB**: Downsample old metrics (1s → 1m → 1h retention policies)
- **ML inference**: Use ONNX runtime for 10x faster inference vs scikit-learn pickle
- **Model updates**: Blue/green model swap — load new model, validate, then promote
- **Alert deduplication**: Redis SETEX with src_ip+attack_type key (60s TTL) to suppress floods
