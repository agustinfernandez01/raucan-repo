/**
 * Cliente HTTP para la API (backend).
 * Base URL: configurar según entorno (dev/prod).
 */
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

export async function getProductos(): Promise<unknown[]> {
  const res = await fetch(`${API_BASE}/productos/`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('API no disponible');
  return res.json();
}
