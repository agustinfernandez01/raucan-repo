/**
 * Rutas de la aplicación. Usar aquí en lugar de strings sueltos.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTOS: '/productos',
  PRODUCTO_DETAIL: '/productos/:id',
  CARRITO: '/carrito',
  PEDIDOS: '/pedidos',
  PEDIDO_DETAIL: '/pedidos/:id',
  PERFIL: '/perfil',
  MASCOTAS: '/perfil/mascotas',
  MASCOTA_NUEVA: '/perfil/mascotas/nueva',
  MASCOTA_EDITAR: '/perfil/mascotas/editar/:id',
  NOT_FOUND: '*',
} as const;

/** Rutas del panel de administración (prefijo /admin) */
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  PEDIDOS: '/admin/pedidos',
  PEDIDO_DETAIL: '/admin/pedidos/:id',
  PRODUCTOS: '/admin/productos',
  USUARIOS: '/admin/usuarios',
  STOCK: '/admin/stock',
} as const;

export function productDetailPath(id: string): string {
  return `/productos/${id}`;
}

export function pedidoDetailPath(id: string): string {
  return `/pedidos/${id}`;
}

export function adminPedidoDetailPath(id: string): string {
  return `/admin/pedidos/${id}`;
}

export function mascotaEditarPath(id: string | number): string {
  return `/perfil/mascotas/editar/${id}`;
}
