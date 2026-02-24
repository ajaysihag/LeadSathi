import { createContext, useContext, useState, useEffect } from "react";
import { auth as authApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("leadsathi_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem("leadsathi_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = (email, password) =>
    authApi.login(email, password).then((data) => {
      localStorage.setItem("leadsathi_token", data.access_token);
      return authApi.me().then(setUser);
    });

  const register = (data) =>
    authApi.register(data).then((res) => {
      localStorage.setItem("leadsathi_token", res.access_token);
      return authApi.me().then(setUser);
    });

  const logout = () => {
    localStorage.removeItem("leadsathi_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
