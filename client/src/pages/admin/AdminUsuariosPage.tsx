import { useEffect, useState } from 'react';
import { getUsuarios } from '../../services/usuarios';
import type { Usuario } from '../../types/usuario';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const filtrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.apellido?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.rol?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Usuarios</h1>
        <input
          type="search"
          placeholder="Buscar por nombre, email, rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 w-full sm:w-64 focus:ring-2 focus:ring-raucan-lavanda/50 focus:border-raucan-lavanda"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-600">Cargando usuarios…</p>
      ) : filtrados.length === 0 ? (
        <div className="py-12 text-center rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-slate-600">
            {usuarios.length === 0
              ? 'No hay usuarios registrados.'
              : 'No se encontraron usuarios con ese criterio.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((u) => (
                <tr key={String(u.id)} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">
                      {u.nombre} {u.apellido ?? ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-slate-600 text-sm">{u.telefono ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        u.rol === 'admin'
                          ? 'bg-raucan-lavanda/20 text-raucan-lavanda'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {u.rol ?? 'cliente'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.activo !== false ? (
                      <span className="text-green-600 text-sm">Activo</span>
                    ) : (
                      <span className="text-slate-400 text-sm">Inactivo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
