import { apiFetch } from './api';

export interface LoginBody {
  email: string;
  password: string;
}

export async function login(body: LoginBody): Promise<{ token?: string; usuario?: unknown }> {
  return apiFetch<{ token?: string; usuario?: unknown }>('/login/', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function logout(): Promise<void> {
  // Si el backend tiene endpoint de logout (invalidar token)
  // return apiFetch('/logout', { method: 'POST' });
}
