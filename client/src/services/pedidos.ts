import { apiFetch } from './api';
import type { Pedido } from '../types/pedido';

export async function getPedidos(): Promise<Pedido[]> {
  return apiFetch<Pedido[]>('/pedidos/');
}

export async function getPedido(id: string): Promise<Pedido> {
  return apiFetch<Pedido>(`/pedidos/${id}`);
}

export async function crearPedido(payload: {
  direccion_entrega?: string;
  observaciones?: string;
}): Promise<Pedido> {
  return apiFetch<Pedido>('/pedidos/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
