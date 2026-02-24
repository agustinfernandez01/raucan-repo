import { apiFetch } from './api';
import type { Producto } from '../types/producto';


export async function getProductos(categoria_producto_id: number | undefined): Promise<Producto[]> {

  if (categoria_producto_id !== undefined) {
    const data = await apiFetch<Producto[]>(`/productos/getproductos?categoria_producto_id=${categoria_producto_id}`);
    return data;
  }
  const data = await apiFetch<Producto[]>('/productos/getproductos');
  return data;
}

<<<<<<< HEAD
export async function getProducto(id: number): Promise<Producto> {
  const data = await apiFetch<Producto>(`/productos/getproductos/${id}`);
  return data;
=======
export async function getProducto(id: string): Promise<Producto> {
  const data = await apiFetch<Record<string, unknown>>(`/productos/${id}`);
  return normalizeProducto(data);
}

function normalizeProducto(raw: Record<string, unknown>): Producto {
  return {
    id: String(raw.id),
    nombre: String(raw.nombre),
    precioPorKg: Number(raw.precio_por_kg ?? raw.precioPorKg ?? 0),
    precio_por_kg: Number(raw.precio_por_kg ?? raw.precioPorKg ?? 0),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : undefined,
    categoria_id: raw.categoria_id != null ? Number(raw.categoria_id) : undefined,
    categoria: raw.categoria != null ? String(raw.categoria) : undefined,
    imagen_url: raw.imagen_url != null ? String(raw.imagen_url) : undefined,
    activo: raw.activo !== false,
  };
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
}
