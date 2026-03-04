interface InputProps {
    label: string
    name: string
    value: string | number
    onChange: any
    type?: string
  }
  
  export const InputModal = ({
    label,
    name,
    value,
    onChange,
    type = "text",
  }: InputProps) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black transition"
      />
    </div>
  )