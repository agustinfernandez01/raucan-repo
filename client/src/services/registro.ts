import type { UsuarioCreate } from "../types/usuario";
import { apiFetch } from "./api";

export async function registro(data: UsuarioCreate, path: string) {
    return apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}


