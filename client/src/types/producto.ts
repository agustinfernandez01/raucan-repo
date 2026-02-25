/**
 * Tipos para productos (comida de animales por kg). Alineados al backend.
 */
export interface Producto {
  id: string;
  nombre: string;
  precioPorKg: number;
  precio_por_kg?: number;
  descripcion?: string;
  categoria_producto?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  imagen_url?: string;
  activo?: boolean;
}

export interface ProductoCreate {
  nombre: string;
  precioPorKg: number;
  descripcion?: string;
  categoria_producto?: number;
  imagen_url?: string;
  activo?: boolean;
}

export interface ProductoUpdate {
  nombre?: string;
  precioPorKg?: number;
  descripcion?: string;
  categoria_producto?: number;
  imagen_url?: string;
  activo?: boolean;
}