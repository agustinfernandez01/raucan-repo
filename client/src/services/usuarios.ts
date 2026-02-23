import { apiFetch } from './api';
import type { Usuario } from '../types/usuario';

export async function getUsuarios(): Promise<Usuario[]> {
  return apiFetch<Usuario[]>('/usuarios/get-usuarios');
}

export async function getUsuario(id: string | number): Promise<Usuario> {
  return apiFetch<Usuario>(`/usuarios/get/${id}`);
}

export async function crearUsuario(data: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  rol: string;
  password: string;
}): Promise<Usuario> {
  return apiFetch<Usuario>('/usuarios/post-usuario', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function actualizarUsuario(
  id: string | number,
  data: Partial<{
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    rol: string;
    activo: boolean;
    password: string;
  }>
): Promise<Usuario> {
  return apiFetch<Usuario>(`/usuarios/patch/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
