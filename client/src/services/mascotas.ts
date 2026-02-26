import { apiFetch, API_BASE } from './api';
import type { Mascota } from '../types/mascota';

const TOKEN_KEY = 'raucan_token';

export async function getMascotas(usuarioId?: string | number): Promise<Mascota[]> {
  const qs = usuarioId != null ? `?usuario_id=${usuarioId}` : '';
  return apiFetch<Mascota[]>(`/mascotas/${qs}`);
}

export async function getMascota(id: string | number): Promise<Mascota> {
  return apiFetch<Mascota>(`/mascotas/${id}`);
}

export async function createMascota(data: Partial<Mascota>): Promise<Mascota> {
  return apiFetch<Mascota>('/mascotas/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMascota(id: string | number, data: Partial<Mascota>): Promise<Mascota> {
  return apiFetch<Mascota>(`/mascotas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteMascota(id: string | number): Promise<void> {
  await apiFetch(`/mascotas/${id}`, { method: 'DELETE' });
}

/** Sube una foto para la mascota (multipart/form-data). Devuelve la mascota actualizada con foto_url. */
export async function uploadMascotaFoto(id: string | number, file: File): Promise<Mascota> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const formData = new FormData();
  formData.append('file', file);
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}/mascotas/${id}/foto`, {
    method: 'PATCH',
    body: formData,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json();
}
