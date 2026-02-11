import { useState, useEffect } from 'react';
import * as productosService from '../../services/productos';
import type { Producto } from '../../types/producto';
import { formatPrecio } from '../../utils/formatters';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    productosService
      .getProductos()
      .then(setProductos)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar productos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="text-slate-600">Cargando productos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Productos</h1>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-700">Nombre</th>
              <th className="px-4 py-3 font-medium text-slate-700">Precio/kg</th>
              <th className="px-4 py-3 font-medium text-slate-700">Categoría</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-slate-500 text-center">
                  No hay productos.
                </td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.nombre}</td>
                  <td className="px-4 py-3">
                    {formatPrecio(p.precioPorKg ?? p.precio_por_kg ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.categoria ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Para crear o editar productos podés usar la API (POST/PATCH /productos) o agregar un
        formulario aquí.
      </p>
    </div>
  );
}
