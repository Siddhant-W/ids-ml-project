import random
from datetime import datetime

ATTACK_TYPES = ["DoS — SYN Flood","Port Scan — Probe",
  "Brute Force SSH","HTTP Flood","DNS Amplification",
  "ICMP Flood","U2R Escalation","R2L Access","ARP Spoofing"]
PROTOCOLS = ["TCP","UDP","ICMP","HTTP","HTTPS","DNS","SSH","FTP"]
SEVERITIES = ["CRITICAL","HIGH","MEDIUM","LOW"]
SRC_IPS = ["45.33.32.156","203.0.113.14","198.51.100.7",
           "192.0.2.100","10.0.2.55","192.168.12.44"]

def generate_alert() -> dict:
  sev = random.choices(SEVERITIES, weights=[15,35,35,15])[0]
  return {
    "id": "ALT-" + str(random.randint(10000,99999)),
    "timestamp": datetime.now().isoformat(),
    "severity": sev,
    "type": random.choice(ATTACK_TYPES),
    "src_ip": random.choice(SRC_IPS + ["172.16.0." + str(random.randint(1,254))]),
    "dst_ip": "10.0.0." + str(random.randint(1,50)),
    "protocol": random.choice(PROTOCOLS),
    "status": "BLOCKED" if random.random() > 0.3 else "DETECTED",
    "ml_confidence": round(random.uniform(87,99.9), 1),
  }

def generate_packet() -> dict:
  is_malicious = random.random() < 0.12
  return {
    "timestamp": datetime.now().isoformat(),
    "src_ip": random.choice(SRC_IPS + ["172.16.0." + str(random.randint(1,254))]),
    "dst_ip": "10.0.0." + str(random.randint(1,50)),
    "protocol": random.choice(PROTOCOLS),
    "src_port": random.randint(1024, 65535),
    "dst_port": random.choice([80,443,22,21,53,8080,3389]),
    "length": random.randint(40,1400),
    "classification": random.choice(["DoS","Probe"]) if is_malicious else "NORMAL",
  }

def generate_real_alert(prediction: str, source_ip: str, row_index: int) -> dict:
  severity_map = {
    "Normal": None,
    "DoS": "High",
    "Probe": "Medium",
    "R2L": "High",
    "U2R": "Critical",
  }
  return {
    "id": f"ALT-ML-{row_index}-{random.randint(10000, 99999)}",
    "timestamp": datetime.now().isoformat(),
    "source_ip": source_ip,
    "attack_type": prediction,
    "severity": severity_map.get(prediction),
    "status": "active",
  }

# In-memory stores
_alerts = [generate_alert() for _ in range(50)]
_packets = [generate_packet() for _ in range(100)]
_policies = [
  {"id":"p1","name":"Block SYN Flood Attacks","type":"FIREWALL","severity":"CRITICAL","enabled":True,"action":"BLOCK"},
  {"id":"p2","name":"SSH Brute Force Mitigation","type":"IPS","severity":"HIGH","enabled":True,"action":"BLOCK"},
  {"id":"p3","name":"Port Scan Detection","type":"IDS","severity":"MEDIUM","enabled":True,"action":"ALERT"},
  {"id":"p4","name":"DNS Anomaly Alerting","type":"MONITOR","severity":"LOW","enabled":False,"action":"LOG"},
  {"id":"p5","name":"HTTP Flood Rate Limit","type":"WAF","severity":"HIGH","enabled":True,"action":"DROP"},
  {"id":"p6","name":"Zero-Day Heuristic Alert","type":"ML","severity":"CRITICAL","enabled":True,"action":"BLOCK"},
  {"id":"p7","name":"ICMP Flood Detection","type":"FIREWALL","severity":"MEDIUM","enabled":False,"action":"DROP"},
  {"id":"p8","name":"R2L Session Anomaly","type":"IDS","severity":"HIGH","enabled":True,"action":"ALERT"}
]

def get_alerts(severity=None, status=None, limit=50):
  data = _alerts
  if severity: data = [a for a in data if a["severity"]==severity]
  if status: data = [a for a in data if a["status"]==status]
  return data[:limit]

def add_alert(alert): _alerts.insert(0, alert)
def get_packets(limit=50): return _packets[:limit]
def get_policies(): return _policies
def toggle_policy(id): 
  for p in _policies:
    if p["id"]==id: 
        p["enabled"] = not p["enabled"]
        return p
  return None
