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
  categoria_producto?: {
    id: number;
    nombre: string;
    descripcion?: string;
  };
  imagen_url?: string;
  activo?: boolean;
  unidad?: 'kg';
}

export interface ProductoCreate {
  nombre: string;
  precioPorKg?: number;
  precio_por_kg?: number;
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