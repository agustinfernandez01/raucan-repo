import { apiFetch } from './api';
import type { Mascota } from '../types/mascota';

export async function getMascotas(): Promise<Mascota[]> {
  return apiFetch<Mascota[]>('/mascotas/');
}

export async function createMascota(data: Partial<Mascota>): Promise<Mascota> {
  return apiFetch<Mascota>('/mascotas/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateMascota(id: string, data: Partial<Mascota>): Promise<Mascota> {
  return apiFetch<Mascota>(`/mascotas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteMascota(id: string): Promise<void> {
  await apiFetch(`/mascotas/${id}`, { method: 'DELETE' });
}
