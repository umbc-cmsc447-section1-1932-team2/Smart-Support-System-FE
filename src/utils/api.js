import toast from "react-hot-toast";

export const BASE_URL = "http://127.0.0.1:5000";

export async function apiFetch(path, method = "GET", data = null) {
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data && method !== "GET" && method !== "DELETE") {
    config.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);
    const payload = await res.json().catch(() => null);
    const raw = payload?.message;

    const messages = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (!res.ok) {
      messages.forEach((m) => toast.error(m));
    } else {
      messages.forEach((m) => toast.success(m));
    }
    return {
      ok: res.ok,
      status: res.status,
      messages,
      data: payload?.data ?? null,
    };
  } catch {
    toast.error("Network error — could not reach server");
    return { ok: false, status: null, messages: null, data: null };
  }
}
