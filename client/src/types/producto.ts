/**
 * Tipos para productos (comida de animales por kg). Alineados al backend.
 */
export interface Producto {
  id: string;
  nombre: string;
  precioPorKg: number;
  precio_por_kg?: number;
  descripcion?: string;
<<<<<<< HEAD
  categoria_producto?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  imagen_url?: string;
=======
  categoria_id?: number;
  categoria?: string;
  imagen_url?: string;
  activo?: boolean;
  unidad?: 'kg';
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
}
