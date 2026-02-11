import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  nombre: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (_email: string, _password: string) => {
    // TODO: llamar al service de auth y guardar token + user
    setUser({ id: '1', email: _email, nombre: 'Usuario' });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
