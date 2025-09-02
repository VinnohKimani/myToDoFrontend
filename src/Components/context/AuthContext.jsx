import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const safeParse = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ✅ NEW: derive role from user
  const role = user?.role || "user";
  const isAdmin = role === "admin"; // ✅ helper

  const login = (userData, accessToken) => {
    if (userData && accessToken) {
      setUser(userData);
      setToken(accessToken);

      // ✅ Store role inside user
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", accessToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role, // ✅ added
        isAdmin, // ✅ added
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
