import { apiFetch } from './api';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto';

// por categoria o todos
export async function getProductos(categoria_producto_id: number | undefined): Promise<Producto[]> {

  if (categoria_producto_id !== undefined) {
    const data = await apiFetch<Producto[]>(`/productos/getproductos?categoria_producto_id=${categoria_producto_id}`);
    return data;
  }
  const data = await apiFetch<Producto[]>('/productos/getproductos');
  return data;
}

// por id
export async function getProductoById(id: number): Promise<Producto> {
  const data = await apiFetch<Producto>(`/productos/getproductos/${id}`);
  return data;
}

// crear
export async function crearProducto(producto: ProductoCreate): Promise<Producto> {
  const data = await apiFetch<Producto>('/productos/postproductos', {
    method: 'POST',
    body: JSON.stringify(producto),
  });
  return data;
}

// actualizar
export async function actualizarProducto(id: number, producto: ProductoUpdate): Promise<Producto> {
  const data = await apiFetch<Producto>(`/productos/patchproductos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(producto),
  });
  return data;
}

// eliminar

  export async function eliminarProducto(id: number): Promise<void> {
    const data = await apiFetch<void>(`/productos/deleteproductos/${id}`, {
      method: 'DELETE',
    });
    return data;
  }