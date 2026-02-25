import { apiFetch } from './api';

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string | Record<string, string>;
  usuario?: unknown;
}

export async function login(body: LoginBody): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/login/auth', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logout(): Promise<void> {
  // Si el backend tiene endpoint de logout (invalidar token)
  // return apiFetch('/logout', { method: 'POST' });
}

const TOKEN_KEY = 'raucan_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Decodifica el payload del JWT sin verificar (solo para leer sub en el cliente) */
export function decodeTokenPayload(token: string): { sub?: string; role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as { sub?: string; role?: string };
  } catch {
    return null;
  }
}
