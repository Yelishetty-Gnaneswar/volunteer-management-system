import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore auth on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = (authData) => {
    const userData = {
      email: authData.email,
      role: authData.role,
    };

    setUser(userData);
    setToken(authData.token);

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // ❌ DO NOT clear everything
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ⏳ Prevent rendering before auth restore
  if (loading) {
    return null; // or <Loader />
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
