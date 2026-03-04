import { useEffect, useState, useMemo } from "react";
import type { IResponseStockDeposito } from "../../types/stock_deposito";
import {
  getStockDeposito,
  getStockDepositoById,
  deleteStockDeposito,
} from "../../services/stock_deposito";
import { getDepositos } from "../../services/deposito";
import { getProductos } from "../../services/productos";
import { StockModal } from "../../components/modals/stock_deposito/StockModal";
import type { IProductoSimple } from "../../types/producto";
import type { IDeposito } from "../../types/deposito";

const inputClass =
  "w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none";

const selectClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none bg-white";

const badgeBase =
  "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";

interface StockDepositoUI extends IResponseStockDeposito {
  actualizado_en?: string;
}

export default function AdminStockPage() {
  const [stockRows, setStockRows] = useState<StockDepositoUI[]>([]);
  const [depositos, setDepositos] = useState<IDeposito[]>([]);
  const [productos, setProductos] = useState<IProductoSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filterDeposito, setFilterDeposito] = useState<string>("todos");
  const [filterStock, setFilterStock] = useState<"todos" | "con_stock" | "sin_stock">("todos");
  const [filterUpdated, setFilterUpdated] = useState<"todos" | "actualizados" | "sin_fecha">("todos");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedStock, setSelectedStock] =
    useState<StockDepositoUI | null>(null);

  // -------------------------
  // Load Data
  // -------------------------
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [depositosData, stockData, productosData] = await Promise.all([
          getDepositos(),
          getStockDeposito(),
          getProductos(),
        ]);

        if (!cancelled) {
          setDepositos(depositosData);
          setStockRows(stockData);
          setProductos(productosData);
        }
      } catch {
        if (!cancelled) {
          setError("Error al cargar datos");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const depositoSeleccionado = useMemo(() => {
    if (filterDeposito === "todos") return null;
    return depositos.find((d) => String(d.id) === filterDeposito) ?? null;
  }, [depositos, filterDeposito]);

  const stockDelDeposito = useMemo(() => {
    if (filterDeposito === "todos") return stockRows;
    return stockRows.filter(
      (r) => String(r.deposito?.id) === filterDeposito
    );
  }, [stockRows, filterDeposito]);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return stockDelDeposito.filter((r) => {
      const matchSearch =
        !q ||
        r.nombre?.toLowerCase().includes(q) ||
        r.descripcion?.toLowerCase().includes(q) ||
        String(r.producto?.id).includes(q) ||
        r.producto?.nombre?.toLowerCase().includes(q) ||
        r.deposito?.nombre?.toLowerCase().includes(q);
      const matchStock =
        filterStock === "todos" ||
        (filterStock === "con_stock" && r.cantidad_producto > 0) ||
        (filterStock === "sin_stock" && r.cantidad_producto === 0);
      const matchUpdated =
        filterUpdated === "todos" ||
        (filterUpdated === "actualizados" && !!r.actualizado_en) ||
        (filterUpdated === "sin_fecha" && !r.actualizado_en);
      return matchSearch && matchStock && matchUpdated;
    });
  }, [stockDelDeposito, busqueda, filterStock, filterUpdated]);

  const stats = useMemo(() => {
    const totalItems = stockDelDeposito.length;
    const conStock = stockDelDeposito.filter(
      (r) => (r.cantidad_producto ?? 0) > 0
    ).length;
    const sinStock = stockDelDeposito.filter(
      (r) => (r.cantidad_producto ?? 0) <= 0
    ).length;
    const totalCantidad = stockDelDeposito.reduce(
      (acc, r) => acc + (r.cantidad_producto ?? 0),
      0
    );
    const fechas = stockDelDeposito
      .map((r) => r.actualizado_en)
      .filter(Boolean) as string[];
    const lastUpdated = fechas.length ? fechas.sort().at(-1) ?? null : null;
    return { totalItems, conStock, sinStock, totalCantidad, lastUpdated };
  }, [stockDelDeposito]);

  // -------------------------
  // Helpers
  // -------------------------
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("es-AR").format(num);

  const safeText = (text?: string | null) =>
    text && text.trim() !== "" ? text : "-";

  // -------------------------
  // CRUD Actions
  // -------------------------
  const handleCreate = () => {
    setSelectedStock(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const data = await getStockDepositoById(id);
      setSelectedStock(data);
      setModalMode("edit");
      setModalOpen(true);
    } catch {
      setError("No se pudo cargar el registro");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este stock?")) return;

    try {
      await deleteStockDeposito(id);
      setStockRows((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("No se pudo eliminar");
    }
  };

  const handleSuccess = async () => {
    const data = await getStockDeposito();
    setStockRows(data);
    setModalOpen(false);
  };

  const handleActualizar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [depositosData, stockData, productosData] = await Promise.all([
        getDepositos(),
        getStockDeposito(),
        getProductos(),
      ]);
      setDepositos(depositosData);
      setStockRows(stockData);
      setProductos(productosData);
    } catch {
      setError("Error al actualizar datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start md:items-center justify-between gap-4 mb-6 flex-col md:flex-row">
            <div>
              <h1 className="text-3xl font-semibold text-[#2D2D2D]">
                Depósitos
              </h1>
              <p className="text-gray-500 mt-1">
                Visualiza el stock de productos por depósito
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="px-4 py-2.5 text-sm font-medium text-white bg-[#8896fc] rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Agregar stock
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Depósito
                </label>
                <select
                  value={filterDeposito}
                  onChange={(e) => setFilterDeposito(e.target.value)}
                  className={selectClass}
                >
                  <option value="todos">Todos los depósitos</option>
                  {depositos.map((d) => (
                    <option key={d.id} value={String(d.id)}>
                      {d.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Nombre, id producto, descripción..."
                    className={inputClass}
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Stock
                </label>
                <select
                  value={filterStock}
                  onChange={(e) =>
                    setFilterStock(
                      e.target.value as "todos" | "con_stock" | "sin_stock"
                    )
                  }
                  className={selectClass}
                >
                  <option value="todos">Todos</option>
                  <option value="con_stock">Con stock</option>
                  <option value="sin_stock">Sin stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                  Actualización
                </label>
                <select
                  value={filterUpdated}
                  onChange={(e) =>
                    setFilterUpdated(
                      e.target.value as "todos" | "actualizados" | "sin_fecha"
                    )
                  }
                  className={selectClass}
                >
                  <option value="todos">Todos</option>
                  <option value="actualizados">Con fecha</option>
                  <option value="sin_fecha">Sin fecha</option>
                </select>
              </div>
            </div>

            {/* Depósito resumen */}
            {depositoSeleccionado && (
              <div className="mt-5 border-t border-gray-100 pt-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8896fc] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#8896fc]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#2D2D2D]">
                        {depositoSeleccionado.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {safeText(depositoSeleccionado.descripcion)} •{" "}
                        {safeText(depositoSeleccionado.ubicacion)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {depositoSeleccionado.estado !== false ? (
                      <span
                        className={`${badgeBase} bg-green-100 text-green-800`}
                      >
                        Activo
                      </span>
                    ) : (
                      <span
                        className={`${badgeBase} bg-red-100 text-red-800`}
                      >
                        Inactivo
                      </span>
                    )}
                    <span
                      className={`${badgeBase} bg-gray-100 text-gray-700`}
                    >
                      Dirección: {safeText(depositoSeleccionado.direccion)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Ítems en stock</p>
                <p className="text-2xl font-semibold text-[#2D2D2D] mt-1">
                  {stats.totalItems}
                </p>
              </div>
              <div className="p-3 bg-[#8896fc] bg-opacity-10 rounded-lg">
                <svg
                  className="w-6 h-6 text-[#8896fc]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7h18M3 12h18M3 17h18"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Con stock</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {stats.conStock}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Sin stock</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">
                  {stats.sinStock}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cantidad total</p>
                <p className="text-2xl font-semibold text-[#ffa9e0] mt-1">
                  {formatNumber(stats.totalCantidad)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Últ. act: {stats.lastUpdated ?? "—"}
                </p>
              </div>
              <div className="p-3 bg-[#ffa9e0] bg-opacity-10 rounded-lg">
                <svg
                  className="w-6 h-6 text-[#ffa9e0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10V6m0 12v-2m9-4a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Cargando stock...
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actualizado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtrados.length > 0 ? (
                    filtrados.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#8896fc] bg-opacity-10 rounded-full flex items-center justify-center">
                              <span className="text-[#8896fc] font-semibold">
                                {row.nombre?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#2D2D2D]">
                                {row.nombre}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID producto: {row.producto?.id ?? row.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {safeText(row.descripcion)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Stock ID: {row.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`${badgeBase} ${
                              row.cantidad_producto > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            title={
                              row.cantidad_producto > 0
                                ? "Con stock"
                                : "Sin stock"
                            }
                          >
                            {formatNumber(row.cantidad_producto)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`${badgeBase} bg-gray-100 text-gray-700`}
                          >
                            {row.actualizado_en ?? "NULL"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(row.id)}
                              className="text-[#8896fc] hover:text-[#ffa9e0] transition-colors p-2 hover:bg-[#8896fc] hover:bg-opacity-10 rounded-lg"
                              title="Editar"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(row.id)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition"
                              title="Eliminar"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"
                            />
                          </svg>
                          <p className="text-gray-500 text-lg font-medium">
                            {filterDeposito === "todos"
                              ? "No se encontraron registros de stock"
                              : "No se encontró stock para este depósito"}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Probá cambiando los filtros o agregá stock
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando{" "}
                  <span className="font-medium">{filtrados.length}</span> de{" "}
                  <span className="font-medium">{stockDelDeposito.length}</span>{" "}
                  {filterDeposito === "todos"
                    ? "registros"
                    : "registros del depósito"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Exportar
                  </button>
                  <button
                    type="button"
                    onClick={handleActualizar}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#8896fc] rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        <StockModal
          isOpen={modalOpen}
          mode={modalMode}
          initialData={selectedStock}
          productos={productos}
          depositos={depositos}
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
