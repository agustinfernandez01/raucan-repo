import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../contexts/CarritoContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrecio, formatKg } from '../../utils/formatters';
import { crearPedido } from '../../services/pedidos';
import { ROUTES } from '../../constants/routes';
import type { CarritoItem } from '../../contexts/CarritoContext';

function CarritoItemCard({
  item,
  onUpdate,
  onRemove,
}: {
  item: CarritoItem;
  onUpdate: (cantidadKg: number) => void;
  onRemove: () => void;
}) {
  const precio = item.producto.precioPorKg ?? item.producto.precio_por_kg ?? 0;
  const subtotal = precio * item.cantidadKg;

  return (
    <article className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_12px_40px_rgba(136,150,252,0.18)] hover:-translate-y-0.5 transition-all duration-200">
      {/* Imagen + Info principal */}
      <div className="flex gap-4 flex-1 min-w-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl bg-gradient-to-br from-raucan-rosa/25 to-raucan-lavanda/20 flex items-center justify-center overflow-hidden">
          {item.producto.imagen_url ? (
            <img
              src={item.producto.imagen_url}
              alt={item.producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl sm:text-4xl" aria-hidden>🐕</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-raucan-gris text-[14px] sm:text-[15px] leading-tight truncate">
            {item.producto.nombre}
          </h3>
          <p className="text-[12px] sm:text-[13px] text-gray-500 mt-0.5">
            {formatPrecio(precio)} / kg
          </p>

          {/* Controles de cantidad - visible en desktop */}
          <div className="hidden sm:flex flex-wrap items-center gap-2 mt-3">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
              <button
                type="button"
                onClick={() => onUpdate(Math.max(0.5, item.cantidadKg - 0.5))}
                className="w-9 h-9 rounded-l-full flex items-center justify-center text-raucan-gris hover:bg-raucan-lavanda/15 font-bold transition-colors"
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="min-w-[3rem] text-center font-bold text-raucan-gris text-sm">
                {formatKg(item.cantidadKg)}
              </span>
              <button
                type="button"
                onClick={() => onUpdate(item.cantidadKg + 0.5)}
                className="w-9 h-9 rounded-r-full flex items-center justify-center text-raucan-gris hover:bg-raucan-lavanda/15 font-bold transition-colors"
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold bg-white text-gray-500 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 transition-all"
              aria-label="Quitar del carrito"
            >
              Quitar
            </button>
          </div>

          {/* Subtotal en móvil - junto al nombre */}
          <p className="sm:hidden font-extrabold text-raucan-lavanda text-base mt-2">
            {formatPrecio(subtotal)}
          </p>
        </div>
      </div>

      {/* Controles de cantidad - móvil (debajo) */}
      <div className="flex sm:hidden items-center justify-between gap-2 pt-2 border-t border-gray-100">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.07)]">
          <button
            type="button"
            onClick={() => onUpdate(Math.max(0.5, item.cantidadKg - 0.5))}
            className="w-10 h-10 rounded-l-full flex items-center justify-center text-raucan-gris hover:bg-raucan-lavanda/15 font-bold transition-colors"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="min-w-[3.5rem] text-center font-bold text-raucan-gris text-sm">
            {formatKg(item.cantidadKg)}
          </span>
          <button
            type="button"
            onClick={() => onUpdate(item.cantidadKg + 0.5)}
            className="w-10 h-10 rounded-r-full flex items-center justify-center text-raucan-gris hover:bg-raucan-lavanda/15 font-bold transition-colors"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-bold bg-white text-gray-500 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 transition-all"
          aria-label="Quitar del carrito"
        >
          Quitar
        </button>
      </div>

      {/* Subtotal - desktop (a la derecha) */}
      <div className="hidden sm:block text-right shrink-0">
        <p className="font-extrabold text-raucan-gris text-lg">
          {formatPrecio(subtotal)}
        </p>
        <p className="text-[13px] text-gray-500">subtotal</p>
      </div>
    </article>
  );
}

export default function CarritoPage() {
  const { items, updateItem, removeItem, clear } = useCarrito();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total =
    items.reduce((acc, i) => {
      const p = i.producto.precioPorKg ?? i.producto.precio_por_kg ?? 0;
      return acc + p * i.cantidadKg;
    }, 0) ?? 0;

  const totalKg = items.reduce((acc, i) => acc + i.cantidadKg, 0);

  const handleConfirmar = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: ROUTES.CARRITO } });
      return;
    }
    if (items.length === 0) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const pedido = await crearPedido({});
      clear();
      navigate(`/pedidos/${pedido.id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudo crear el pedido. Intentá de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}>
        <div className="text-center max-w-md">
          <span className="text-7xl block mb-4" aria-hidden>🛒</span>
          <h1 className="text-2xl font-extrabold text-raucan-gris mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-8">
            Explorá nuestra selección y agregá productos para mimar a tu mascota.
          </p>
          <Link
            to={ROUTES.PRODUCTOS}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold bg-raucan-lavanda !text-white hover:opacity-90 shadow-[0_4px_16px_rgba(136,150,252,0.35)] transition-all"
          >
            Ver productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero al estilo Productos */}
        <div className="rounded-[20px] px-6 py-6 mb-8 bg-gradient-to-r from-raucan-lavanda to-[#a78bfa]">
          <div className="text-white/90 text-[13px] font-bold tracking-widest uppercase mb-1">
            Tu carrito
          </div>
          <h1 className="text-white text-2xl md:text-[28px] font-extrabold leading-tight">
            {items.length} {items.length === 1 ? 'producto' : 'productos'} · {formatKg(totalKg)} en total
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Revisá cantidades y confirmá tu pedido cuando estés listo.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <CarritoItemCard
              key={item.producto.id}
              item={item}
              onUpdate={(qty) => updateItem(item.producto.id, qty)}
              onRemove={() => removeItem(item.producto.id)}
            />
          ))}
        </div>

        {/* Contenedor con degradado */}
        <aside className="relative rounded-[22px] p-[3px] bg-gradient-to-br from-raucan-lavanda via-raucan-rosa to-[#f9a8d4] shadow-[0_4px_20px_rgba(136,150,252,0.25)] sticky bottom-4">
          <div className="bg-white rounded-[20px] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-[13px] font-semibold text-gray-500">
                  Total ({formatKg(totalKg)})
                </p>
                <p className="text-2xl font-extrabold text-raucan-gris">
                  {formatPrecio(total)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <button
                  type="button"
                  onClick={handleConfirmar}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-[0_4px_16px_rgba(136,150,252,0.35)]"
                  style={{ backgroundColor: '#8896fc', color: 'white' }}
                >
                  {isSubmitting ? 'Procesando…' : 'Confirmar pedido'}
                </button>
                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 text-center sm:text-left">
                    Iniciá sesión para finalizar la compra
                  </p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
