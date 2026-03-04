// PAGINAR --> paginacion
import { useState, useEffect, useMemo } from 'react';
import { getProductos, crearProducto, actualizarProducto } from '../../services/productos';
import { formatPrecio } from '../../utils/formatters';
import type { Producto } from '../../types/producto';
import type { ProductoCreate, ProductoPatch } from '../../types/producto';
import ProductoModal from '../../components/modals/ProductoModal';
import type { CategoriaProductoSimple } from '../../types/categoria_producto';


export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categorias, setCategorias] = useState<string[]>(['Todas las categorías']);
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [filterActivo, setFilterActivo] = useState('todos');

  // ✅ Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  type CategoriaParaModal = {
    id: number;
    nombre: string;
  };

  // ✅ categorias para el modal (id + nombre)
  const categoriasModal: CategoriaParaModal[] = useMemo(() => {
    const map = new Map<string, number>();
    let id = 0;
    productos.forEach((p) => {
      const c = p.categoria_producto;
      if (c?.nombre) map.set(c.nombre, id++);
    });
    return Array.from(map.entries()).map(([nombre, id]) => ({ id, nombre }));
  }, [productos]);

  const recargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      setProductos(data);
      const cats = [...new Set(data.map((p) => p.categoria_producto?.nombre).filter(Boolean))] as string[];
      setCategorias(cats);
    } catch (err: any) {
      setError(err?.message ?? 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    recargarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        (p.nombre?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ?? false) ||
        (p.descripcion?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ?? false);

      const matchCategoria = filterCategoria === 'todas' || p.categoria_producto?.nombre === filterCategoria;

      const matchActivo =
        filterActivo === 'todos' ||
        (filterActivo === 'activos' && p.activo === true) ||
        (filterActivo === 'inactivos' && p.activo === false);

      return matchSearch && matchCategoria && matchActivo;
    });
  }, [productos, searchTerm, filterCategoria, filterActivo]);

  // ✅ Abrir modal: Nuevo
  const abrirNuevoProducto = () => {
    setModalMode('create');
    setProductoSeleccionado(null);
    setModalOpen(true);
  };

  // ✅ Abrir modal: Editar
  const abrirEditarProducto = (producto: Producto) => {
    setModalMode('edit');
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  // ✅ Crear
  const handleCreate = async (payload: ProductoCreate) => {
    // Conectalo a tu service real:
    await crearProducto(payload);

  };

  // ✅ Editar
  const handleEdit = async (id: number, payload: ProductoPatch) => {
    // Conectalo a tu service real:
    await actualizarProducto(id, payload);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#2D2D2D]">Productos</h1>
              <p className="text-gray-500 mt-1">Gestiona tu inventario de productos</p>
            </div>

            {/* ✅ Botón NUEVO abre modal */}
            <button
              onClick={abrirNuevoProducto}
              className="px-6 py-2.5 bg-[#8896fc] text-white font-medium rounded-lg hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Producto
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Buscar</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o descripción..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categoria Filter */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Categoría</label>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none bg-white"
                >
                  <option value="todas">Todas las categorías</option>
                  {categorias.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado Filter */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">Estado</label>
                <select
                  value={filterActivo}
                  onChange={(e) => setFilterActivo(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none bg-white"
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cargando productos...
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio/Kg</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((producto) => (
                      <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">#{producto.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#2D2D2D]">{producto.nombre}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{producto.descripcion || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#8896fc]">{formatPrecio(producto.precio_por_kg || 0)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#8896fc]">{producto.categoria_producto?.nombre || 'Sin categoría'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#8896fc]">{producto.imagen_url || 'Sin imagen'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {producto.activo ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Activo
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Inactivo
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-[#8896fc] hover:text-[#ffa9e0] transition-colors p-2 hover:bg-[#8896fc] hover:bg-opacity-10 rounded-lg"
                              title="Ver"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {/* ✅ Editar abre modal */}
                            <button
                              onClick={() => abrirEditarProducto(producto)}
                              className="text-[#8896fc] hover:text-[#ffa9e0] transition-colors p-2 hover:bg-[#8896fc] hover:bg-opacity-10 rounded-lg"
                              title="Editar"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <p className="text-gray-500 text-lg font-medium">No se encontraron productos</p>
                        <p className="text-gray-400 text-sm mt-1">Intenta cambiar los filtros de búsqueda</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ✅ Modal (uno solo para Nuevo y Editar) */}
        <ProductoModal
          open={modalOpen}
          mode={modalMode}
          producto={productoSeleccionado}
          categorias={categoriasModal}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}