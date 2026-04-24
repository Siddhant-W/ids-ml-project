const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

export function createWebSocket(path, onMessage, onError) {
  const token = sessionStorage.getItem("cs_token");
  const ws = new WebSocket(`${WS_URL}${path}?token=${token}`);
  ws.onmessage = (e) => onMessage(JSON.parse(e.data));
  ws.onerror = onError;
  ws.onclose = () => {
    // Auto-reconnect after 3 seconds
    setTimeout(() => createWebSocket(path, onMessage, onError), 3000);
  };
  return ws;
}
