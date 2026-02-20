import type { UsuarioCreate } from "../types/usuario";

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function registro(data: UsuarioCreate, path: string) {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return response.json();
}


