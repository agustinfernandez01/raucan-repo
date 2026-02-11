/**
 * Rutas de la aplicación. Usar aquí en lugar de strings sueltos.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  PRODUCTOS: '/productos',
  PRODUCTO_DETAIL: '/productos/:id',
  CARRITO: '/carrito',
  PEDIDOS: '/pedidos',
  PEDIDO_DETAIL: '/pedidos/:id',
  PERFIL: '/perfil',
  MASCOTAS: '/perfil/mascotas',
  NOT_FOUND: '*',
} as const;

export function productDetailPath(id: string): string {
  return `/productos/${id}`;
}

export function pedidoDetailPath(id: string): string {
  return `/pedidos/${id}`;
}
