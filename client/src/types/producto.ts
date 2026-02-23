/**
 * Tipos para productos (comida de animales por kg). Alineados al backend.
 */
export interface Producto {
  id: string;
  nombre: string;
  precioPorKg: number;
  precio_por_kg?: number; // por si la API devuelve snake_case
  descripcion?: string;
  categoria_producto?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  imagen_url?: string;
}
