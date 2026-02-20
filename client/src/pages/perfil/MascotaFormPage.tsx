import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getMascota, createMascota, updateMascota } from '../../services/mascotas';
import type { Mascota } from '../../types/mascota';
import { ROUTES } from '../../constants/routes';

const ESPECIES = ['Perro', 'Gato', 'Otro'];

/** Calculadora divertida: peso del perro -> gramos de comida */
function CalculadoraComida({
  pesoKg,
  onPesoChange,
}: {
  pesoKg: string;
  onPesoChange: (v: string) => void;
}) {
  const peso = parseFloat(pesoKg) || 0;
  const gramos = Math.round(peso * 25);
  const pesosRapidos = [3, 8, 15, 25, 40];

  return (
    <div className="bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-3xl">🥣</span>
        <h3 className="font-extrabold text-raucan-gris text-[15px]">Calculadora de alimento</h3>
      </div>
      <p className="text-[13px] text-gray-500 mb-4">
        Ingresá el peso de tu perro y te mostramos cuántos gramos de comida necesita por día.
      </p>
      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-gray-700 mb-2">Peso del perro (kg)</label>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={pesoKg}
            onChange={(e) => onPesoChange(e.target.value)}
            placeholder="Ej: 12.5"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-raucan-lavanda focus:ring-2 focus:ring-raucan-lavanda/30 text-lg font-medium bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {pesosRapidos.map((p) => {
            const active = parseFloat(pesoKg) === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPesoChange(String(p))}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  active
                    ? 'bg-raucan-lavanda text-white shadow-[0_4px_16px_rgba(136,150,252,0.35)]'
                    : 'bg-white text-gray-600 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:border-raucan-lavanda/50'
                }`}
              >
                {p} kg
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center min-h-[140px]">
        <div className="bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] rounded-[18px] p-6 border-2 border-dashed border-raucan-lavanda/30">
          <p className="text-[13px] font-semibold text-gray-500 mb-1">Recomendación diaria</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold text-raucan-gris tabular-nums">
              {peso > 0 ? gramos : '—'}
            </span>
            {peso > 0 && (
              <span className="text-xl font-bold text-raucan-lavanda">gramos</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {peso > 0
              ? '¡Tu perro va a estar bien alimentado! 🐕'
              : 'Agregá el peso para ver el resultado'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MascotaFormPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [calculatorPeso, setCalculatorPeso] = useState('');
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [raza, setRaza] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [notas, setNotas] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!id;

  useEffect(() => {
    if (id && user?.id) {
      setLoading(true);
      getMascota(id)
        .then((m) => {
          setMascota(m);
          setNombre(m.nombre);
          setEspecie(m.especie ?? 'Perro');
          setRaza(m.raza ?? '');
          setPesoKg(m.peso_kg != null ? String(m.peso_kg) : '');
          setNotas(m.notas ?? '');
          setFechaNacimiento(m.fecha_nacimiento ?? '');
          setCalculatorPeso(m.peso_kg != null ? String(m.peso_kg) : '');
        })
        .catch(() => setMascota(null))
        .finally(() => setLoading(false));
    }
  }, [id, user?.id]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
        <div className="text-center max-w-md">
          <span className="text-7xl block mb-4">🐕</span>
          <h1 className="text-2xl font-extrabold text-raucan-gris mb-2">Iniciá sesión</h1>
          <p className="text-gray-600 mb-8">Ingresá a tu cuenta para agregar o editar mascotas.</p>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex px-6 py-3 rounded-full font-bold bg-raucan-lavanda !text-white hover:opacity-90 shadow-[0_4px_16px_rgba(136,150,252,0.35)]"
          >
            Entrar
          </Link>
        </div>
      </main>
    );
  }

  if (isEdit && !loading && !mascota) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]">
        <p className="text-gray-600 mb-4">Mascota no encontrada</p>
        <Link
          to={ROUTES.MASCOTAS}
          className="inline-flex px-4 py-2 rounded-full font-bold bg-raucan-lavanda !text-white hover:opacity-90"
        >
          Volver a mis mascotas
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setError(null);
    setSaving(true);
    try {
      const payload = {
        usuario_id: Number(user.id),
        nombre: nombre.trim(),
        especie,
        raza: raza.trim() || undefined,
        peso_kg: pesoKg ? Number(pesoKg) : undefined,
        notas: notas.trim() || undefined,
        fecha_nacimiento: fechaNacimiento || undefined,
      };
      if (mascota) {
        await updateMascota(mascota.id, payload);
      } else {
        await createMascota(payload);
      }
      navigate(ROUTES.MASCOTAS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]">
        <p className="text-[13px] font-semibold text-gray-500">Cargando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link
          to={ROUTES.MASCOTAS}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-raucan-gris mb-6"
        >
          ← Volver a mis mascotas
        </Link>

        {/* Hero al estilo Productos */}
        <div className="rounded-[20px] px-6 py-6 mb-8 bg-gradient-to-r from-raucan-lavanda to-[#a78bfa]">
          <div className="text-white/90 text-[13px] font-bold tracking-widest uppercase mb-1">
            {isEdit ? 'Editar mascota' : 'Nueva mascota'}
          </div>
          <h1 className="text-white text-2xl md:text-[28px] font-extrabold leading-tight">
            {isEdit ? 'Actualizá los datos' : 'Agregá a tu mascota'}
          </h1>
          <p className="text-white/80 text-sm mt-1 max-w-lg">
            {isEdit
              ? 'Modificá nombre, peso, raza o notas.'
              : 'Completá el formulario y usá la calculadora para la porción recomendada.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:min-h-[420px]">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-6 space-y-4"
            >
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50 focus:border-raucan-lavanda"
                />
              </div>
              <div>
                <label htmlFor="especie" className="block text-sm font-medium text-gray-700 mb-1">
                  Especie
                </label>
                <select
                  id="especie"
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50"
                >
                  {ESPECIES.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="raza" className="block text-sm font-medium text-gray-700 mb-1">
                  Raza
                </label>
                <input
                  id="raza"
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    id="peso"
                    type="number"
                    step="0.1"
                    min="0"
                    value={pesoKg}
                    onChange={(e) => {
                      setPesoKg(e.target.value);
                      setCalculatorPeso(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50"
                  />
                </div>
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (alergias, preferencias)
                </label>
                <textarea
                  id="notas"
                  rows={2}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50"
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-60 shadow-[0_4px_16px_rgba(136,150,252,0.35)] transition-all"
                  style={{ backgroundColor: '#8896fc', color: 'white' }}
                >
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
                <Link
                  to={ROUTES.MASCOTAS}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-bold text-sm bg-white text-gray-500 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
          <div className="lg:min-h-[420px]">
            <CalculadoraComida
              pesoKg={calculatorPeso}
              onPesoChange={(v) => {
                setCalculatorPeso(v);
                setPesoKg(v);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
