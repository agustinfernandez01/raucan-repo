/**
 * Tipos para mascotas (alineados al backend).
 */
export interface Mascota {
  id: string;
  usuario_id: string;
  nombre: string;
  tipo: string;
  raza?: string;
  edad?: string;
  peso_kg?: number;
  alergias_observaciones?: string;
}
