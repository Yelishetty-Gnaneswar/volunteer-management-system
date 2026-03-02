import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role }
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore auth on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSessionId = localStorage.getItem("sessionId");

    if (storedUser && storedSessionId) {
      setUser(JSON.parse(storedUser));
      setSessionId(storedSessionId);
    }

    setLoading(false);
  }, []);

  const login = (authData) => {
    const userData = {
      email: authData.email,
      role: authData.role,
    };

    setUser(userData);
    setSessionId(authData.sessionId);

    localStorage.setItem("sessionId", authData.sessionId);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setSessionId(null);

    localStorage.removeItem("sessionId");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, sessionId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
