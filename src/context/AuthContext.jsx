import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    const onRefreshed = (e) => setUser(e.detail);
    const onForcedLogout = () => setUser(null);
    window.addEventListener("auth:tokens-refreshed", onRefreshed);
    window.addEventListener("auth:logout", onForcedLogout);
    return () => {
      window.removeEventListener("auth:tokens-refreshed", onRefreshed);
      window.removeEventListener("auth:logout", onForcedLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

const homeForRole = (role) =>
  role === "AGENT" || role === "ADMIN" ? "/agent-dashboard" : "/dashboard";

export function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={homeForRole(user.role)} replace />;
  }
  return children;
}
