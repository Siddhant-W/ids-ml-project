from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.api.v1 import auth, alerts, traffic, policy, ml, users
from backend.api.ws import live_feed

app = FastAPI(title="CyberSentinel IDS API", version="2.4.0")

app.add_middleware(CORSMiddleware,
  allow_origins=settings.cors_origins.split(","),
  allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(traffic.router)
app.include_router(policy.router)
app.include_router(ml.router)
app.include_router(users.router)
app.include_router(live_feed.router)

@app.get("/health")
async def health():
  return {"status":"ok","service":"CyberSentinel","version":"2.4.0"}

@app.on_event("startup")
async def startup():
  print("CyberSentinel IDS Backend - Monitoring Active")
