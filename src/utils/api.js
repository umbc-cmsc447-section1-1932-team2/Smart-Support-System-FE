import toast from "react-hot-toast";

// Try switching back to localhost if 127.0.0.1 isn't working
export const BASE_URL = "http://localhost:3000";

const AUTH_BYPASS_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

let refreshPromise = null;

function getStoredUser() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function persistTokens({ accessToken, refreshToken }) {
  const current = getStoredUser();
  if (!current) return null;
  const next = {
    ...current,
    accessToken,
    refreshToken: refreshToken ?? current.refreshToken,
  };
  localStorage.setItem("user", JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("auth:tokens-refreshed", { detail: next }));
  return next;
}

function forceLogout() {
  localStorage.removeItem("user");
  window.dispatchEvent(new CustomEvent("auth:logout"));
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function requestNewAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const user = getStoredUser();
    if (!user?.refreshToken) return null;

    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: user.refreshToken }),
      });

      if (!res.ok) return null;

      const payload = await res.json().catch(() => ({}));
      const tokens = payload?.data ?? payload;
      if (!tokens?.accessToken) return null;

      persistTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
      return tokens.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiFetch(path, method = "GET", data = null, _retried = false) {
  const user = getStoredUser();
  const token = user?.accessToken ?? null;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (data && method !== "GET" && method !== "DELETE") {
    config.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);
    const payload = await res.json().catch(() => ({}));

    const rawMessage = payload?.message;
    const messages = Array.isArray(rawMessage)
      ? rawMessage
      : rawMessage
        ? [rawMessage]
        : [];

    const isAuthBypass = AUTH_BYPASS_PATHS.some((p) => path.includes(p));

    if (res.status === 401 && !_retried && !isAuthBypass && user?.refreshToken) {
      const newAccessToken = await requestNewAccessToken();
      if (newAccessToken) {
        return apiFetch(path, method, data, true);
      }
      // Refresh failed → session is truly dead.
      console.warn("Session expired. Logging out...");
      forceLogout();
      return {
        ok: false,
        status: 401,
        messages,
        data: payload?.data !== undefined ? payload.data : payload,
      };
    }

    if (!res.ok) {
      messages.forEach((m) => toast.error(m));

      // No refresh token (or already retried) → behave like before.
      if (res.status === 401 && !isAuthBypass) {
        console.warn("Session expired. Logging out...");
        forceLogout();
      }
    }

    return {
      ok: res.ok,
      status: res.status,
      messages,
      // For login, the payload IS the user data. For others, it might be in .data
      data: payload?.data !== undefined ? payload.data : payload,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Network error — could not reach server");
    return { ok: false, status: null, messages: null, data: null };
  }
}
