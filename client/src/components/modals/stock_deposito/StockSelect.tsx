interface SelectProps {
    label: string
    name: string
    value: number
    onChange: any
    options: { id: number; nombre: string }[]
  }
  
  export const StockSelect = ({
    label,
    name,
    value,
    onChange,
    options,
  }: SelectProps) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
      >
        <option value={0}>Seleccionar...</option>
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.nombre}
          </option>
        ))}
      </select>
    </div>
  )