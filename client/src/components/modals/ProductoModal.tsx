import React, { useEffect, useMemo, useState } from "react";
import type { Producto } from "../../types/producto";
import type { ProductoCreate } from "../../types/producto";
import type { ProductoPatch } from "../../types/producto";
import type { CategoriaProductoSimple } from "../../types/categoria_producto";


type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  categorias: CategoriaProductoSimple[];

  // Si mode = "edit", pasás el producto actual
  producto?: Producto | null;

  onClose: () => void;

  // Callbacks para que tu página haga el request
  onCreate: (payload: ProductoCreate) => Promise<void>;
  onEdit: (id: number, payload: ProductoPatch) => Promise<void>;
};

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none";

function isEmptyString(v: unknown) {
  return typeof v === "string" && v.trim() === "";
}

export default function ProductoModal({
  open,
  mode,
  categorias,
  producto,
  onClose,
  onCreate,
  onEdit,
}: Props) {
  const isEdit = mode === "edit";

  const title = isEdit ? "Editar producto" : "Nuevo producto";
  const submitLabel = isEdit ? "Guardar cambios" : "Crear producto";

  // Form state (siempre completo, luego lo convertimos a Create o Patch)
  const [nombre, setNombre] = useState("");
  const [precioPorKg, setPrecioPorKg] = useState<string>(""); // string para input
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [activo, setActivo] = useState(true);
  const [categoriaId, setCategoriaId] = useState<string>(""); // string para select

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Precargar datos al abrir en modo editar
  useEffect(() => {
    if (!open) return;

    setError("");

    if (isEdit && producto) {
      setNombre(producto.nombre ?? "");
      setPrecioPorKg(
        typeof producto.precio_por_kg === "number" ? String(producto.precio_por_kg) : ""
      );
      setDescripcion(producto.descripcion ?? "");
      setImagenUrl(producto.imagen_url ?? "");
      setActivo(!!producto.activo);
      setCategoriaId(producto.categoria_producto?.id ? String(producto.categoria_producto.id) : "");
    } else {
      // Reset para create
      setNombre("");
      setPrecioPorKg("");
      setDescripcion("");
      setImagenUrl("");
      setActivo(true);

    }
  }, [open, isEdit, producto]);

  const categoriaSeleccionada = useMemo(() => {
    const id = Number(categoriaId);
    if (!id) return null;
    return categorias.find((c) => c.id === id) ?? null;
  }, [categoriaId, categorias]);

  if (!open) return null;

  const validar = () => {
    if (nombre.trim().length < 2) return "El nombre debe tener al menos 2 caracteres.";
    if (isEmptyString(precioPorKg)) return "El precio por kg es obligatorio.";
    const n = Number(precioPorKg);
    if (Number.isNaN(n) || n <= 0) return "El precio por kg debe ser un número mayor a 0.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const msg = validar();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      const precio = Number(precioPorKg);

      if (!isEdit) {
        // CREATE (ProductoCreate)
        const payload: ProductoCreate = {
          nombre: nombre.trim(),
          precio_por_kg: precio,
          descripcion: descripcion.trim() ? descripcion.trim() : undefined,
          imagen_url: imagenUrl.trim() ? imagenUrl.trim() : undefined,
          activo,
          // Si tu backend REALMENTE recibe el objeto:
          categoria_producto: categoriaSeleccionada ?? undefined,
          // Si recibe id, esto NO va:
          // categoria_producto_id: Number(categoriaId) || null
        };

        await onCreate(payload);
      } else {
        if (!producto?.id) {
          setError("No se encontró el producto a editar.");
          return;
        }

        // PATCH (ProductoPatch) => solo mandamos lo que cambió
        const patch: ProductoPatch = {};

        if (nombre.trim() !== (producto.nombre ?? "")) patch.nombre = nombre.trim();
        if (precio !== (producto.precio_por_kg ?? producto.precio_por_kg)) patch.precio_por_kg = precio;

        const descNorm = descripcion.trim() ? descripcion.trim() : undefined;
        const imgNorm = imagenUrl.trim() ? imagenUrl.trim() : undefined;

        if ((producto.descripcion ?? undefined) !== descNorm) patch.descripcion = descNorm ?? undefined;
        if ((producto.imagen_url ?? undefined) !== imgNorm) patch.imagen_url = imgNorm ?? undefined;
        if (!!producto.activo !== activo) patch.activo = activo;

        const prodCatName = producto.categoria_producto?.nombre ?? null;
        const newCatName = categoriaSeleccionada?.nombre ?? null;
        if (prodCatName !== newCatName) patch.categoria_producto = categoriaSeleccionada ?? undefined;

        await onEdit(Number(producto.id), patch);
      }

      onClose();
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Error al guardar el producto.";
      setError(typeof backendMsg === "string" ? backendMsg : JSON.stringify(backendMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Cerrar modal"
      />

      {/* Card */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-100">
        <div className="flex items-start justify-between gap-4 p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit ? "Actualizá los datos del producto." : "Completá los campos para crear un producto."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input
                className={inputClass}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Alimento Premium"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Precio por kg</label>
              <input
                className={inputClass}
                value={precioPorKg}
                onChange={(e) => setPrecioPorKg(e.target.value)}
                placeholder="Ej: 4200"
                inputMode="decimal"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Descripción</label>
            <textarea
              className={inputClass + " min-h-[90px]"}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Categoría</label>
              <select
                className={inputClass}
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Imagen URL</label>
              <input
                className={inputClass}
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              Activo
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#8896fc] text-white font-medium hover:bg-opacity-90 disabled:opacity-60"
              >
                {loading ? "Guardando..." : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}