/**
 * Tipos para pedidos (alineados al backend).
 */
export interface Pedido {
  id: string;
  usuario_id: string;
  estado: string;
  total: number;
  direccion_entrega?: string;
  creado_en: string;
}

export interface PedidoDetalleItem {
  producto_id: string;
  cantidad_kg: number;
  precio_por_kg: number;
  subtotal?: number;
}
