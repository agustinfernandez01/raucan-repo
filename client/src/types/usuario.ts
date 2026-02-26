/**
 * Tipos para usuario (alineados al backend).
 */
export interface Usuario {
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  telefono_whatsapp?: string;
  rol?: string;
  activo?: boolean;
}

export interface UsuarioCreate extends Usuario {
  password: string;
}