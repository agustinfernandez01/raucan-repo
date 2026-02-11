import { apiFetch } from './api';
import type { ItemCarrito } from '../types/carrito';

export async function getCarrito(): Promise<ItemCarrito[]> {
  return apiFetch<ItemCarrito[]>('/carrito/');
}

export async function addToCarrito(productoId: string, cantidadKg: number): Promise<ItemCarrito> {
  return apiFetch<ItemCarrito>('/carrito/', {
    method: 'POST',
    body: JSON.stringify({ producto_id: productoId, cantidad_kg: cantidadKg }),
  });
}

export async function removeFromCarrito(itemId: string): Promise<void> {
  await apiFetch(`/carrito/${itemId}`, { method: 'DELETE' });
}
