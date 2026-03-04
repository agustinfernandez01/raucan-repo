import { useEffect, useMemo, useState } from "react"
import { InputModal } from "../../ui/InputModal"
import { StockSelect } from "./StockSelect"
import { X } from "lucide-react"
import { createStockDeposito } from "../../../services/stock_deposito"
import { patchStockDeposito } from "../../../services/stock_deposito"


import type {
  IResponseStockDeposito,
  ICreateStockDeposito,
  IStockDepositoPatch,
} from "../../../types/stock_deposito"

import type { IProductoSimple } from "../../../types/producto"
import type { IDepositoSimple } from "../../../types/deposito"

type Mode = "create" | "edit"

interface StockFormValues {
  nombre: string
  descripcion: string
  id_producto: number
  id_deposito: number
  cantidad_producto: number
}

interface Props {
  isOpen: boolean
  mode: Mode
  initialData?: IResponseStockDeposito | null
  productos: IProductoSimple[]
  depositos: IDepositoSimple[]
  onClose: () => void
  onSuccess: () => void
}

export const StockModal = ({
  isOpen,
  mode,
  initialData,
  productos,
  depositos,
  onClose,
  onSuccess,
}: Props) => {
  const emptyForm: StockFormValues = {
    nombre: "",
    descripcion: "",
    id_producto: 0,
    id_deposito: 0,
    cantidad_producto: 0,
  }

  const [form, setForm] = useState<StockFormValues>(emptyForm)
  const [originalForm, setOriginalForm] = useState<StockFormValues | null>(null)
  const [loading, setLoading] = useState(false)

  // Mapper Response → Form
  const mapResponseToForm = (
    data: IResponseStockDeposito
  ): StockFormValues => ({
    nombre: data.nombre,
    descripcion: data.descripcion,
    id_producto: data.producto.id,
    id_deposito: data.deposito.id,
    cantidad_producto: data.cantidad_producto,
  })

  useEffect(() => {
    if (!isOpen) return

    if (mode === "edit" && initialData) {
      const mapped = mapResponseToForm(initialData)
      setForm(mapped)
      setOriginalForm(mapped)
    }

    if (mode === "create") {
      setForm(emptyForm)
      setOriginalForm(null)
    }
  }, [isOpen, mode, initialData])

  const getChangedFields = (): Partial<IStockDepositoPatch> => {
    if (!originalForm) return {}

    const changes: Partial<IStockDepositoPatch> = {}

    if (form.nombre !== originalForm.nombre)
      changes.nombre = form.nombre

    if (form.descripcion !== originalForm.descripcion)
      changes.descripcion = form.descripcion

    if (form.id_producto !== originalForm.id_producto)
      changes.id_producto = form.id_producto

    if (form.id_deposito !== originalForm.id_deposito)
      changes.id_deposito = form.id_deposito

    if (form.cantidad_producto !== originalForm.cantidad_producto)
      changes.cantidad_producto = form.cantidad_producto

    return changes
  }

  const isDirty = useMemo(() => {
    if (mode === "create") return true
    if (!originalForm) return false
    return Object.keys(getChangedFields()).length > 0
  }, [form, originalForm, mode])

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]:
        name === "cantidad_producto" ||
        name === "id_producto" ||
        name === "id_deposito"
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      if (mode === "create") {
        const payload: ICreateStockDeposito = { ...form }
        await createStockDeposito(payload)
      } else if (mode === "edit" && initialData) {
        const changes = getChangedFields()

        if (Object.keys(changes).length === 0) {
          onClose()
          return
        }

        await patchStockDeposito(initialData.id, changes)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {mode === "create" ? "Crear Stock" : "Editar Stock"}
          </h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-black transition" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-5">

          <InputModal
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <InputModal
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />

          <StockSelect
            label="Producto"
            name="id_producto"
            value={form.id_producto}
            onChange={handleChange}
            options={productos}
          />

          <StockSelect
            label="Depósito"
            name="id_deposito"
            value={form.id_deposito}
            onChange={handleChange}
            options={depositos}
          />

          <InputModal
            label="Cantidad"
            name="cantidad_producto"
            type="number"
            value={form.cantidad_producto}
            onChange={handleChange}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8 gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading || (mode === "edit" && !isDirty)}
            className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}