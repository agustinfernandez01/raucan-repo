import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import * as authService from '../services/auth';
import { getUsuario } from '../services/usuarios';

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** False hasta haber revisado el token en localStorage (evita redirigir al login al recargar) */
  authChecked: boolean;
  login: (email: string, password: string, telefono: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEV_ADMIN = import.meta.env.VITE_DEV_ADMIN === 'true';

function userFromApi(raw: unknown): User {
  const o = raw as Record<string, unknown>;
  return {
    id: String(o?.id ?? ''),
    email: String(o?.email ?? ''),
    nombre: String(o?.nombre ?? ''),
    rol: o?.rol != null ? String(o.rol) : DEV_ADMIN ? 'admin' : undefined,
  };
}

function userFromToken(sub: string, email: string): User {
  return {
    id: sub,
    email,
    nombre: 'Usuario',
    rol: DEV_ADMIN ? 'admin' : 'cliente',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const login = useCallback(async (email: string, password: string, telefono: string) => {
    const res = await authService.login({ email, password, telefono });
    if (res.access_token) {
      authService.setStoredToken(res.access_token);
      const payload = authService.decodeTokenPayload(res.access_token);
      const u =
        res.usuario != null
          ? userFromApi(res.usuario)
          : userFromToken(payload?.sub ?? '', email);
      setUserState(u);
    }
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    authService.clearStoredToken();
    authService.logout();
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  // Restaurar sesión desde token al cargar
  useEffect(() => {
    const restoreSession = async () => {
      const token = authService.getStoredToken();
      if (token) {
        const payload = authService.decodeTokenPayload(token);
        if (payload?.sub) {
          try {
            const userData = await getUsuario(payload.sub);
            setUserState(userFromApi(userData));
          } catch {
            setUserState(userFromToken(payload.sub, ''));
          }
        }
      }
      setAuthChecked(true);
    };
    restoreSession();
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    authChecked,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
