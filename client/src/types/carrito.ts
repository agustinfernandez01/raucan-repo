/**
 * Tipos para ítems del carrito (backend).
 */
export interface ItemCarrito {
  id: string;
  usuario_id: string;
  producto_id: string;
  cantidad_kg: number;
  precio_por_kg?: number;
}
