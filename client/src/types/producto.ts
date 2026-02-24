/**
 * Tipos para productos (comida de animales por kg). Alineados al backend.
 */
export interface Producto {
  id: string;
  nombre: string;
  precioPorKg: number;
  precio_por_kg?: number;
  descripcion?: string;
  categoria_id?: number;
  categoria?: string;
  imagen_url?: string;
  activo?: boolean;
  unidad?: 'kg';
}
