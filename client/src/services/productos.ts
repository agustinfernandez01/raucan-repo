import { apiFetch } from './api';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types/producto';

// por categoria o todos
export async function getProductos(categoria_producto_id?: number): Promise<Producto[]> {

  if (categoria_producto_id) {
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

// crear - envía formato API (snake_case)
export async function crearProducto(producto: ProductoCreate): Promise<Producto> {
  const cat = producto.categoria_producto;
  const categoria_producto =
    typeof cat === 'object' && cat != null
      ? { id: cat.id, nombre: cat.nombre, descripcion: cat.descripcion ?? null }
      : null;
  const payload = {
    nombre: producto.nombre,
    precio_por_kg: producto.precioPorKg,
    descripcion: producto.descripcion ?? null,
    categoria_producto,
    imagen_url: producto.imagen_url ?? null,
    activo: producto.activo ?? true,
  };
  const data = await apiFetch<Producto>('/productos/postproductos', {
    method: 'POST',
    body: JSON.stringify(payload),
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