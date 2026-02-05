/**
 * Tipos para productos (comida de animales por kg).
 */
export interface Producto {
  id: string;
  nombre: string;
  precioPorKg: number;
  unidad?: 'kg';
}
