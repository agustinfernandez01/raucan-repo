import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { getUsuario, actualizarUsuario } from '../../services/usuarios';
import type { Usuario } from '../../types/usuario';

export default function PerfilPage() {
  const { user, isAuthenticated } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getUsuario(user.id)
        .then((u) => {
          setUsuario(u);
          setNombre(u.nombre || '');
          setApellido(u.apellido || '');
          setEmail(u.email || '');
          setTelefono(u.telefono || '');
          setDireccion(u.direccion || '');
        })
        .catch(() => setUsuario(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await actualizarUsuario(user.id, {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
      });
      setUsuario(updated);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (usuario) {
      setNombre(usuario.nombre || '');
      setApellido(usuario.apellido || '');
      setEmail(usuario.email || '');
      setTelefono(usuario.telefono || '');
      setDireccion(usuario.direccion || '');
    }
    setEditing(false);
    setError(null);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}>
        <div className="text-center max-w-md">
          <span className="text-7xl block mb-4">👤</span>
          <h1 className="text-2xl font-extrabold text-raucan-gris mb-2">Iniciá sesión</h1>
          <p className="text-gray-600 mb-8">Ingresá a tu cuenta para ver tu perfil.</p>
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Quicksand', system-ui, sans-serif" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Hero al estilo Productos */}
        <div className="rounded-[20px] px-6 py-6 mb-8 bg-gradient-to-r from-raucan-lavanda to-[#a78bfa]">
          <div className="text-white/90 text-[13px] font-bold tracking-widest uppercase mb-1">Mi perfil</div>
          <h1 className="text-white text-2xl md:text-[28px] font-extrabold leading-tight">
            {usuario?.nombre ? `Hola, ${usuario.nombre}` : 'Tu cuenta en Raucan'}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Gestioná tus datos y preferencias.
          </p>
        </div>

        {/* Card Mis datos */}
        <div className="bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 text-xl sm:text-2xl bg-gradient-to-br from-raucan-lavanda/25 to-raucan-rosa/20">
                👤
              </div>
              <div>
                <h2 className="font-extrabold text-raucan-gris text-[15px] leading-tight">Mis datos</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Tu información personal</p>
              </div>
            </div>
            {!editing && !loading && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-full text-sm font-bold bg-raucan-lavanda !text-white hover:opacity-90 transition-all shadow-[0_4px_16px_rgba(136,150,252,0.35)]"
              >
                Editar
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-[13px] text-gray-500 py-4">Cargando datos...</p>
          ) : editing ? (
            <div className="space-y-4 pt-2">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-raucan-lavanda mb-1">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-raucan-lavanda mb-1">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50 text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-raucan-lavanda mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-raucan-lavanda mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-raucan-lavanda mb-1">Dirección</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3 py-2.5 sm:py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-raucan-lavanda/50 text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-60 shadow-[0_4px_16px_rgba(136,150,252,0.35)] transition-all"
                  style={{ backgroundColor: '#8896fc', color: 'white' }}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-full font-bold text-sm bg-white text-gray-500 border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.07)] hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {success && (
                <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  ✓ Datos actualizados correctamente
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide mb-0.5">Nombre</p>
                  <p className="text-sm sm:text-base font-semibold text-raucan-gris">
                    {usuario?.nombre || '—'} {usuario?.apellido || ''}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-sm sm:text-base font-semibold text-raucan-gris truncate">
                    {usuario?.email || '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide mb-0.5">Teléfono</p>
                  <p className="text-sm sm:text-base font-semibold text-raucan-gris">
                    {usuario?.telefono || '—'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                  <p className="text-[11px] sm:text-xs text-gray-500 uppercase tracking-wide mb-0.5">Dirección</p>
                  <p className="text-sm sm:text-base font-semibold text-raucan-gris">
                    {usuario?.direccion || '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Mis mascotas - estilo Productos */}
        <Link
          to={ROUTES.MASCOTAS}
          className="block bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-5 hover:shadow-[0_12px_40px_rgba(136,150,252,0.18)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 text-xl sm:text-2xl bg-gradient-to-br from-raucan-rosa/25 to-raucan-lavanda/20">
              🐕
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-raucan-gris text-[15px] leading-tight">Mis mascotas</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Ver y gestionar las mascotas de tu familia</p>
            </div>
            <span className="text-raucan-lavanda font-bold text-sm shrink-0">Ir →</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
