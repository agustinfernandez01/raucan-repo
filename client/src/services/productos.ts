import { apiFetch } from './api';
import type { Producto } from '../types/producto';

export async function getProductos(): Promise<Producto[]> {
  const data = await apiFetch<Record<string, unknown>[]>('/productos/');
  return data.map(normalizeProducto);
}

export async function getProducto(id: string): Promise<Producto> {
  const data = await apiFetch<Record<string, unknown>>(`/productos/${id}`);
  return normalizeProducto(data);
}

function normalizeProducto(raw: Record<string, unknown>): Producto {
  return {
    id: String(raw.id),
    nombre: String(raw.nombre),
    precioPorKg: Number(raw.precio_por_kg ?? raw.precioPorKg ?? 0),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : undefined,
    categoria: raw.categoria != null ? String(raw.categoria) : undefined,
    imagen_url: raw.imagen_url != null ? String(raw.imagen_url) : undefined,
  };
}
