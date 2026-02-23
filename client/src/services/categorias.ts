import type { CategoriaProducto } from "../types/categoria_producto";
import { apiFetch } from "./api";
import { normalizeCategoriaProducto } from "../types/categoria_producto";


export async function getCategorias(): Promise<CategoriaProducto[]> {
  const data = await apiFetch<Record<string, unknown>[]>('/categoria_producto/getcategorias');
  return data.map(normalizeCategoriaProducto);
}

