const API_BASE = "https://chasing-light.winnowork.com";

//const API_BASE = "http://localhost";


async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, options);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }
  return data;
}

// items_mas: ["A",1..8]
export async function apiCreateSession(items_mas) {
  return apiFetch("/api/session/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items_mas })
  });
}

export async function apiReadSession(id) {
  return apiFetch(`/api/session/read/${encodeURIComponent(id)}`);
}

export async function apiUpdateSession(id, items_mas) {
  return apiFetch("/api/session/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, items_mas })
  });
}

export async function apiDeleteSession(id) {
  return apiFetch(`/api/session/delete/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export async function apiFindSessionByUserId(userId) {
  return apiFetch(`/api/session/find/${encodeURIComponent(userId)}`);
}
