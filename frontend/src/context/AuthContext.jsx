import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bf_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("bf_user", JSON.stringify(user));
      localStorage.setItem("bf_user_role", user.role);
    } else {
      localStorage.removeItem("bf_user");
      localStorage.removeItem("bf_user_role");
    }
  }, [user]);

  const login = (email, name, role = "customer") => {
    setUser({
      name: name || email.split("@")[0],
      email,
      role,
    });
  };

  const register = (name, email, role = "customer") => {
    setUser({ name, email, role });
  };

  const logout = () => setUser(null);

  const isCustomer = user?.role === "customer";
  const isCook = user?.role === "cook";
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isCustomer, isCook, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
