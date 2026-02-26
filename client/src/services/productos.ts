import { apiFetch } from './api';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto';

export async function getProductos(categoria_producto_id?: number): Promise<Producto[]> {
  if (categoria_producto_id !== undefined) {
    const data = await apiFetch<Producto[]>(`/productos/getproductos?categoria_producto_id=${categoria_producto_id}`);
    return data;
  }
  const data = await apiFetch<Producto[]>('/productos/getproductos');
  return data;
}

export async function getProducto(id: number): Promise<Producto> {
  return apiFetch<Producto>(`/productos/getproductos/${id}`);
}

export async function crearProducto(producto: ProductoCreate): Promise<Producto> {
  return apiFetch<Producto>('/productos/postproductos', {
    method: 'POST',
    body: JSON.stringify(producto),
  });
}

// actualizar
export async function actualizarProducto(id: number, producto: ProductoUpdate): Promise<Producto> {
  const data = await apiFetch<Producto>(`/productos/patchproductos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(producto),
  });
  return data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await apiFetch<void>(`/productos/deleteproductos/${id}`, { method: 'DELETE' });
}