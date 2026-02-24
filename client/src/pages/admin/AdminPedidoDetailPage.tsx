import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../constants/routes';
import * as pedidosService from '../../services/pedidos';
import * as productosService from '../../services/productos';
import * as usuariosService from '../../services/usuarios';
import type { PedidoConDetalles } from '../../types/pedido';
import type { Producto } from '../../types/producto';
import type { Usuario } from '../../types/usuario';
import { formatPrecio, formatFecha, formatKg } from '../../utils/formatters';

const ESTADOS = ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'] as const;

const estadoConfig: Record<string, { bg: string; text: string; label: string }> = {
  pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
  confirmado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmado' },
  en_preparacion: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'En Preparación' },
  enviado: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Enviado' },
  entregado: { bg: 'bg-green-100', text: 'text-green-800', label: 'Entregado' },
  cancelado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
};

export default function AdminPedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<PedidoConDetalles | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [productos, setProductos] = useState<Map<number, Producto>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        const pedidoData = await pedidosService.getPedido(id);
        if (cancelled) return;
        setPedido(pedidoData);

        // Load usuario
        try {
          const usuarioData = await usuariosService.getUsuario(pedidoData.usuario_id);
          if (!cancelled) setUsuario(usuarioData);
        } catch {
          // Usuario may not be accessible
        }

        // Load productos
        try {
          const productosData = await productosService.getProductos();
          if (!cancelled) {
            const map = new Map<number, Producto>();
            productosData.forEach((p) => map.set(Number(p.id), p));
            setProductos(map);
          }
        } catch {
          // Productos may fail
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [id]);

  const handleEstadoChange = async (nuevoEstado: string) => {
    if (!pedido || !id) return;
    setUpdating(true);
    try {
      await pedidosService.actualizarPedido(id, { estado: nuevoEstado });
      setPedido({ ...pedido, estado: nuevoEstado });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar');
    } finally {
      setUpdating(false);
    }
  };

  const getEstadoStyle = (estado: string) => {
    const config = estadoConfig[estado] || estadoConfig.pendiente;
    return `${config.bg} ${config.text}`;
  };

  const getEstadoLabel = (estado: string) => {
    return estadoConfig[estado]?.label || estado;
  };

  const getProductoNombre = (productoId: number) => {
    return productos.get(productoId)?.nombre || `Producto #${productoId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-500">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando pedido...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-500">
            Pedido no encontrado.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={ADMIN_ROUTES.PEDIDOS}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a pedidos
          </Link>
        </div>

        {/* Title & Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[#2D2D2D]">Pedido #{pedido.id}</h1>
              <p className="text-gray-500 mt-1">
                Creado el {formatFecha(pedido.creado_en)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getEstadoStyle(pedido.estado)}`}>
                {getEstadoLabel(pedido.estado)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#2D2D2D]">Productos</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {pedido.detalles && pedido.detalles.length > 0 ? (
                  pedido.detalles.map((detalle) => (
                    <div key={detalle.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#8896fc] bg-opacity-10 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#8896fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-[#2D2D2D]">{getProductoNombre(detalle.producto_id)}</p>
                          <p className="text-sm text-gray-500">
                            {formatKg(detalle.cantidad_kg)} × {formatPrecio(detalle.precio_por_kg)}/kg
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#8896fc]">{formatPrecio(detalle.subtotal)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    Sin productos en este pedido.
                  </div>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-[#2D2D2D]">Total</span>
                  <span className="text-2xl font-bold text-[#8896fc]">{formatPrecio(pedido.total)}</span>
                </div>
              </div>
            </div>

            {/* Notas */}
            {pedido.notas_internas && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-3">Notas Internas</h2>
                <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{pedido.notas_internas}</p>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Cambiar Estado */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Cambiar Estado</h2>
              <select
                value={pedido.estado}
                onChange={(e) => handleEstadoChange(e.target.value)}
                disabled={updating}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none bg-white disabled:opacity-50"
              >
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {getEstadoLabel(estado)}
                  </option>
                ))}
              </select>
              {updating && (
                <p className="text-sm text-gray-500 mt-2">Actualizando...</p>
              )}
            </div>

            {/* Cliente */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Cliente</h2>
              {usuario ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ffa9e0] bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-[#ffa9e0] font-semibold">
                        {usuario.nombre?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[#2D2D2D]">
                        {usuario.nombre} {usuario.apellido || ''}
                      </p>
                      <p className="text-sm text-gray-500">{usuario.email}</p>
                    </div>
                  </div>
                  {usuario.telefono && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {usuario.telefono}
                    </div>
                  )}
                  {usuario.direccion && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>{usuario.direccion}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Usuario #{pedido.usuario_id}</p>
              )}
            </div>

            {/* Entrega */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">Entrega</h2>
              <div className="space-y-3">
                {(pedido.direccion_entrega || usuario?.direccion) ? (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span>{pedido.direccion_entrega || usuario?.direccion}</span>
                      {!pedido.direccion_entrega && usuario?.direccion && (
                        <span className="block text-xs text-gray-400 mt-0.5">(dirección del cliente)</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin dirección especificada</p>
                )}
                {pedido.metodo_pago && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="capitalize">{pedido.metodo_pago}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
