const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getToken = () => sessionStorage.getItem("cs_token");

const headers = () => ({
  "Content-Type": "application/json",
  ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {})
});

const request = async (method, path, body = null) => {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : null
  });
  if (res.status === 401) {
    sessionStorage.clear();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const uploadRequest = async (path, formData) => {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: {
      ...(getToken() ? { "Authorization": `Bearer ${getToken()}` } : {})
    },
    body: formData
  });
  if (res.status === 401) {
    sessionStorage.clear();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const api = {
  login: (email, password, role) =>
    request("POST", "/api/v1/auth/login", { email, password, role }),
  me: () => request("GET", "/api/v1/auth/me"),

  getAlerts: (params = {}) =>
    request("GET", "/api/v1/alerts?" + new URLSearchParams(params)),
  acknowledgeAlert: (id) =>
    request("PATCH", `/api/v1/alerts/${id}`, { status: "ACKNOWLEDGED" }),
  blockIP: (id) =>
    request("POST", `/api/v1/alerts/${id}/block`),

  getTrafficStats: () => request("GET", "/api/v1/traffic/stats"),
  getLivePackets: () => request("GET", "/api/v1/traffic/live"),

  getPolicies: () => request("GET", "/api/v1/policy"),
  togglePolicy: (id) =>
    request("POST", `/api/v1/policy/${id}/toggle`),
  createPolicy: (data) => request("POST", "/api/v1/policy", data),
  simulateRule: (data) =>
    request("POST", "/api/v1/policy/simulate", data),

  getMLMetrics: () => request("GET", "/api/v1/ml/metrics"),
  getFeatures: () => request("GET", "/api/v1/ml/features"),
  trainModel: () => request("POST", "/api/v1/ml/train"),

  uploadAndTrain: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return uploadRequest("/ml/upload-and-train", fd);
  },
  classifyTraffic: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return uploadRequest("/ml/classify", fd);
  },
  getMLStatus: () => request("GET", "/ml/status"),
};
