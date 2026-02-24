import { apiFetch } from './api';
import type { Pedido, PedidoConDetalles } from '../types/pedido';

export interface PedidoDetalleCreate {
  producto_id: number;
  cantidad_kg: number;
  precio_por_kg: number;
}

export interface CrearPedidoPayload {
  usuario_id: number;
  direccion_entrega?: string;
  notas_internas?: string;
  detalles: PedidoDetalleCreate[];
}

export interface ActualizarPedidoPayload {
  estado?: string;
  metodo_pago?: string;
  direccion_entrega?: string;
  mensaje_enviado?: string;
  canal_mensaje?: string;
  notas_internas?: string;
}

export async function getPedidos(): Promise<Pedido[]> {
  return apiFetch<Pedido[]>('/pedidos/');
}

export async function getPedido(id: string): Promise<PedidoConDetalles> {
  return apiFetch<PedidoConDetalles>(`/pedidos/${id}`);
}

export async function crearPedido(payload: CrearPedidoPayload): Promise<Pedido> {
  return apiFetch<Pedido>('/pedidos/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function actualizarPedido(id: string, payload: ActualizarPedidoPayload): Promise<Pedido> {
  return apiFetch<Pedido>(`/pedidos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
