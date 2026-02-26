import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMascotas, deleteMascota } from '../../services/mascotas';
import type { Mascota } from '../../types/mascota';
import { ROUTES, mascotaEditarPath } from '../../constants/routes';
import { getRecomendacionAlimento } from '../../utils/recomendacionAlimento';
import { API_BASE } from '../../services/api';
import { Link } from 'react-router-dom';

function MascotaCard({
  mascota,
  onDeleted,
}: {
  mascota: Mascota;
  onDeleted: (id: string | number) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${mascota.nombre}?`)) return;
    setDeleting(true);
    try {
      await deleteMascota(mascota.id);
      onDeleted(mascota.id);
    } finally {
      setDeleting(false);
    }
  };

  const especieIcon =
    mascota.especie === 'Gato' ? '🐱' :
    mascota.especie === 'Perro' ? '🐕' : '🐾';

  const recomendacion = getRecomendacionAlimento(mascota.especie, mascota.peso_kg);

  return (
    <article className="bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-5 sm:p-6 hover:shadow-[0_12px_40px_rgba(136,150,252,0.18)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-br from-raucan-rosa/25 to-raucan-lavanda/20">
          {mascota.foto_url ? (
            <img
              src={`${API_BASE}${mascota.foto_url}`}
              alt={mascota.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl sm:text-4xl">{especieIcon}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-raucan-gris text-base sm:text-lg leading-tight mb-1.5 capitalize">
            {mascota.nombre}
          </h3>
          <p className="text-sm sm:text-[15px] text-gray-500">
            {mascota.especie ?? 'Perro'}
            {mascota.raza && ` · ${mascota.raza}`}
          </p>
          {mascota.peso_kg != null && (
            <p className="text-sm sm:text-[15px] text-gray-600 mt-0.5">{mascota.peso_kg} kg</p>
          )}
          {mascota.notas && (
            <p className="text-sm sm:text-[15px] text-gray-500 mt-2 line-clamp-2">{mascota.notas}</p>
          )}
          {recomendacion && (
            <p className="text-sm sm:text-[15px] mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-gray-500">Comida recomendada:</span>
              <span className="font-bold text-raucan-lavanda">{recomendacion.texto}/día</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
        <Link
          to={mascotaEditarPath(mascota.id)}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-3 rounded-full text-sm sm:text-base font-bold bg-raucan-lavanda !text-white hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(136,150,252,0.35)]"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-3 rounded-full text-sm sm:text-base font-bold bg-white text-gray-500 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:border-red-200 hover:text-red-600 hover:bg-red-50/50 disabled:opacity-50 transition-all"
        >
          {deleting ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}

export default function MascotasPage() {
  const { user, isAuthenticated } = useAuth();
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const loadMascotas = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getMascotas(user.id);
      setMascotas(Array.isArray(data) ? data : []);
    } catch {
      setMascotas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMascotaDeleted = (id: string | number) => {
    setMascotas((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadMascotas();
    } else {
      setLoading(false);
      setMascotas([]);
    }
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-raucan-rosa/10 to-[#e8e8ec]">
        <div className="text-center max-w-md">
          <span className="text-7xl block mb-4">🐕</span>
          <h1 className="text-2xl font-bold text-raucan-gris mb-2">Iniciá sesión</h1>
          <p className="text-gray-600 mb-8">
            Ingresá a tu cuenta para ver y gestionar las mascotas de tu familia.
          </p>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex px-6 py-3 rounded-full font-semibold bg-raucan-amarillo text-raucan-gris hover:bg-raucan-amarillo/90"
          >
            Entrar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link
          to={ROUTES.PERFIL}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-raucan-gris mb-6"
        >
          ← Volver al perfil
        </Link>
        {/* Hero al estilo Productos */}
        <div className="rounded-[20px] px-6 py-6 md:py-7 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-raucan-lavanda to-[#a78bfa]">
          <div>
            <div className="text-white/90 text-[13px] font-bold tracking-widest uppercase mb-1">Mis mascotas</div>
            <h1 className="text-white text-2xl md:text-[28px] font-extrabold leading-tight">
              Gestioná los datos de tus mascotas
            </h1>
            <p className="text-white/80 text-sm mt-1 max-w-md">
              Personalizá sus pedidos y recomendaciones.
            </p>
          </div>
          <Link
            to={ROUTES.MASCOTA_NUEVA}
            className="shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm bg-white text-raucan-lavanda hover:bg-white/95 shadow-lg transition-all"
          >
            + Nueva mascota
          </Link>
        </div>

        {loading ? (
          <p className="text-[13px] font-semibold text-gray-500">Cargando mascotas…</p>
        ) : mascotas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
            <span className="text-6xl block mb-3">🐶</span>
            <h2 className="text-lg font-extrabold text-raucan-gris mb-2">
              Aún no tenés mascotas registradas
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Agregá a tu perro o gato para que podamos recomendarte mejor la comida.
            </p>
            <Link
              to={ROUTES.MASCOTA_NUEVA}
              className="inline-flex px-5 py-2.5 rounded-full font-bold text-sm bg-raucan-lavanda !text-white hover:bg-raucan-lavanda/90 shadow-[0_4px_16px_rgba(136,150,252,0.35)] transition-all"
            >
              + Agregar mascota
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mascotas.map((m) => (
              <MascotaCard key={m.id} mascota={m} onDeleted={handleMascotaDeleted} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
