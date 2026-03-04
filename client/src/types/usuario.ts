/**
 * Tipos para usuario (alineados al backend).
 */
export interface Usuario {
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  telefono_whatsapp?: string;
}

export interface UsuarioCreate {
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  password: string;
}