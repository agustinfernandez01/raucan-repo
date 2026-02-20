import { apiFetch } from './api';
import type { Mascota } from '../types/mascota';

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
