/**
 * Tipos para mascotas (alineados al backend).
 */
export interface Mascota {
  id: string | number;
  usuario_id: string | number;
  nombre: string;
  especie?: string;
  raza?: string;
  fecha_nacimiento?: string;
  peso_kg?: number;
  notas?: string;
}
