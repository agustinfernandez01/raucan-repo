/**
 * Tipos para usuario (alineados al backend).
 */
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  telefono_whatsapp?: string;
  direccion?: string;
  rol?: string;
}
