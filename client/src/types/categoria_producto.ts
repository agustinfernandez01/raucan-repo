export type CategoriaProducto = {
  id: number;
  nombre: string;
  descripcion?: string;
}

export function normalizeCategoriaProducto(raw: Record<string, unknown>): CategoriaProducto {
  return {
    id: Number(raw.id),
    nombre: String(raw.nombre),
    descripcion: raw.descripcion != null ? String(raw.descripcion) : undefined,
  };
}