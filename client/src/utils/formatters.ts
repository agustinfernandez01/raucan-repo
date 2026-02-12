/**
 * Utilidades de formateo (precio, fecha, etc.).
 */
export function formatPrecio(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
}

export function formatKg(kg: number): string {
  return `${kg} kg`;
}

export function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
