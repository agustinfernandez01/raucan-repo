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

export async function getProducto(id: number): Promise<Producto> {
  const data = await apiFetch<Producto>(`/productos/getproductos/${id}`);
  return data;
}
