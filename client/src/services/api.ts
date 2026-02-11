/**
 * Cliente base para la API. Base URL según entorno.
 */
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  return apiFetch<{ status: string }>('/health');
}
