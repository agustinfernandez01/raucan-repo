/**
 * Tipos para usuario (alineados al backend).
 */
export interface Usuario {
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
<<<<<<< HEAD
=======
  telefono_whatsapp?: string;
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
  rol?: string;
  activo?: boolean;
}

export interface UsuarioCreate extends Usuario {
  password: string;
}