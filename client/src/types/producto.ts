/**
 * Tipos para productos (comida de animales por kg). Alineados al backend.
 */
export interface Producto {
  id: number;
  nombre: string;
  precio_por_kg?: number;
  descripcion?: string;
  categoria_producto?: {
    id: number;
    nombre: string;
  };
  imagen_url?: string;
  activo?: boolean;
}

export interface IProductoSimple {
  id: number;
  nombre: string;
}

export interface ProductoCreate {
  nombre: string;
  precio_por_kg: number;
  descripcion?: string;
  /** ID de categoría (frontend) o objeto completo para la API */
  categoria_producto?: { nombre: string; descripcion?: string };
  imagen_url?: string;
  activo?: boolean;
}

export interface ProductoPatch {
  nombre?: string;
  precio_por_kg?: number;
  descripcion?: string;
  categoria_producto?: number | { id: number; nombre: string; descripcion?: string };
  imagen_url?: string;
  activo?: boolean;
}

export interface ProductoUpdate {
  nombre?: string;
  precio_por_kg?: number;
  descripcion?: string;
  categoria_producto?: number;
  imagen_url?: string;
  activo?: boolean;
}