/**
 * Tipos para pedidos (alineados al backend).
 */
export interface Pedido {
  id: string;
  usuario_id: string;
  estado: string;
  metodo_pago?: string;
  total: number;
  direccion_entrega?: string;
  mensaje_enviado?: string;
  canal_mensaje?: string;
  notas_internas?: string;
  creado_en: string;
  actualizado_en?: string;
}

export interface PedidoDetalle {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad_kg: number;
  precio_por_kg: number;
  subtotal: number;
}

export interface PedidoConDetalles extends Pedido {
  detalles: PedidoDetalle[];
}

export interface PedidoDetalleItem {
  producto_id: string;
  cantidad_kg: number;
  precio_por_kg: number;
  subtotal?: number;
}
