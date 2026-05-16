import toast from "react-hot-toast";

// Try switching back to localhost if 127.0.0.1 isn't working
export const BASE_URL = "http://localhost:3000";

export async function apiFetch(path, method = "GET", data = null) {
  const storedUser = localStorage.getItem("user");
  let token = null;

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      token = parsedUser.accessToken; 
    } catch (e) {
      console.error("Could not parse user from local storage");
    }
  }

  // Diagnostic log
  console.log(`🚀 API ${method} to ${path} | Token: ${token ? "YES" : "NO"}`);

  const config = {
    method,
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
  };

  if (data && method !== "GET" && method !== "DELETE") {
    config.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, config);
    
    // Handle empty responses safely
    const payload = await res.json().catch(() => ({}));
    
    // Extract messages for the toast
    const rawMessage = payload?.message;
    const messages = Array.isArray(rawMessage) ? rawMessage : rawMessage ? [rawMessage] : [];

    if (!res.ok) {
  // Only toast if it's NOT a background check (optional)
  messages.forEach((m) => toast.error(m));

  // Only clear storage if we are 100% sure the token is dead
  if (res.status === 401 && !path.includes('/auth/login')) {
    console.warn("Session expired. Logging out...");
    localStorage.removeItem("user");
    // Only redirect if we aren't already on the login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
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