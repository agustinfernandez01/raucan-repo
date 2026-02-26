/**
 * Tipos para productos (comida de animales por kg). Alineados al backend.
 */
export interface Producto {
  id: string | number;
  nombre: string;
  precioPorKg?: number;
  precio_por_kg?: number;
  descripcion?: string | null;
  categoria_id?: number;
  categoria?: string | null;
  imagen_url?: string;
  activo?: boolean;
  unidad?: 'kg';
}
