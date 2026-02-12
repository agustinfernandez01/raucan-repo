import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../constants/routes';
import * as pedidosService from '../../services/pedidos';
import type { Pedido } from '../../types/pedido';
import { formatPrecio, formatFecha } from '../../utils/formatters';

export default function AdminPedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    pedidosService.getPedido(id).then(
      (data) => { if (!cancelled) setPedido(data); },
      (e) => { if (!cancelled) setError(e instanceof Error ? e.message : 'Error'); }
    ).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className="text-slate-600">Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!pedido) return <p className="text-slate-600">Pedido no encontrado.</p>;

  return (
    <div>
      <div className="mb-6">
        <Link to={ADMIN_ROUTES.PEDIDOS} className="text-slate-600 hover:text-slate-900 text-sm font-medium">
          ← Volver a pedidos
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Pedido #{pedido.id}</h1>
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <p><span className="text-slate-500">Estado:</span> <span className="font-medium">{pedido.estado}</span></p>
        <p><span className="text-slate-500">Total:</span> {formatPrecio(pedido.total)}</p>
        <p><span className="text-slate-500">Fecha:</span> {formatFecha(pedido.creado_en)}</p>
        {pedido.direccion_entrega && (
          <p><span className="text-slate-500">Dirección:</span> {pedido.direccion_entrega}</p>
        )}
      </div>
    </div>
  );
}
