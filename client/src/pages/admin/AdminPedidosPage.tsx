import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminPedidoDetailPath } from '../../constants/routes';
import * as pedidosService from '../../services/pedidos';
import type { Pedido } from '../../types/pedido';
import { formatPrecio, formatFecha } from '../../utils/formatters';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    pedidosService.getPedidos().then(
      (data) => {
        if (!cancelled) setPedidos(data);
      },
      (e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar pedidos');
      }
    ).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p className="text-slate-600">Cargando pedidos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Pedidos</h1>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-700">ID</th>
              <th className="px-4 py-3 font-medium text-slate-700">Estado</th>
              <th className="px-4 py-3 font-medium text-slate-700">Total</th>
              <th className="px-4 py-3 font-medium text-slate-700">Fecha</th>
              <th className="px-4 py-3 font-medium text-slate-700"></th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-slate-500 text-center">
                  No hay pedidos.
                </td>
              </tr>
            ) : (
              pedidos.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">{p.id}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formatPrecio(p.total)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatFecha(p.creado_en)}</td>
                  <td className="px-4 py-3">
                    <Link to={adminPedidoDetailPath(String(p.id))} className="text-slate-600 hover:text-slate-900 font-medium">
                      Ver
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
