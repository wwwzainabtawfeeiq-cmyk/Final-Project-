import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'cook' | 'admin';

interface User {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name?: string, role?: UserRole) => void;
  register: (name: string, email: string, role?: UserRole) => void;
  logout: () => void;
  isCustomer: boolean;
  isCook: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bf_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bf_user', JSON.stringify(user));
      localStorage.setItem('bf_user_role', user.role);
    } else {
      localStorage.removeItem('bf_user');
      localStorage.removeItem('bf_user_role');
    }
  }, [user]);

  const login = (email: string, name?: string, role: UserRole = 'customer') => {
    setUser({
      name: name || email.split('@')[0],
      email,
      role,
    });
  };

  const register = (name: string, email: string, role: UserRole = 'customer') => {
    setUser({ name, email, role });
  };

  const logout = () => setUser(null);

  const isCustomer = user?.role === 'customer';
  const isCook = user?.role === 'cook';
  const isAdmin = user?.role === 'admin';

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
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}