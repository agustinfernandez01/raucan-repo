# Estructura del frontend — Raucan

Propuesta de organización del cliente (Vite + React + TypeScript) alineada con el backend (productos, usuarios, auth, carrito, pedidos, mascotas).

---

## Árbol de carpetas propuesto

```
client/src/
├── app/                      # Configuración de la app
│   └── router.tsx            # Rutas (React Router)
├── components/
│   ├── ui/                    # Componentes reutilizables genéricos
│   │   └── (Button, Input, Card, Spinner, etc.)
│   ├── layout/                # Layout global
│   │   └── (Layout, Header, Footer)
│   └── shared/                # Componentes de dominio compartidos
│       └── (ProductCard, CartBadge, etc.)
├── pages/                     # Una carpeta por “pantalla” o flujo
│   ├── home/
│   │   └── HomePage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── productos/
│   │   ├── ProductosPage.tsx       # Catálogo / listado
│   │   └── ProductoDetailPage.tsx  # Detalle de producto
│   ├── carrito/
│   │   └── CarritoPage.tsx
│   ├── pedidos/
│   │   ├── PedidosPage.tsx         # Mis pedidos
│   │   └── PedidoDetailPage.tsx
│   ├── perfil/
│   │   ├── PerfilPage.tsx
│   │   └── MascotasPage.tsx
│   └── not-found/
│       └── NotFoundPage.tsx
├── hooks/                     # Hooks reutilizables
│   ├── useAuth.ts
│   ├── useCarrito.ts
│   └── useProductos.ts
├── services/                  # Llamadas a la API (uno por dominio)
│   ├── api.ts                 # Cliente base (base URL, interceptors)
│   ├── productos.ts
│   ├── auth.ts
│   ├── carrito.ts
│   ├── pedidos.ts
│   └── mascotas.ts
├── types/                     # Tipos e interfaces (alineados al backend)
│   ├── producto.ts
│   ├── usuario.ts
│   ├── carrito.ts
│   ├── pedido.ts
│   └── mascota.ts
├── contexts/                  # Estado global (auth, carrito)
│   ├── AuthContext.tsx
│   └── CarritoContext.tsx
├── constants/
│   └── routes.ts              # Paths de rutas en un solo lugar
├── utils/                     # Helpers (formateo, validación)
│   └── formatters.ts
├── assets/
├── App.tsx
├── main.tsx
└── index.css
```

---

## Descripción por carpeta

| Carpeta        | Uso |
|----------------|-----|
| **app/**       | Router y configuración de rutas. Punto único donde se definen path y componente por pantalla. |
| **components/ui/** | Botones, inputs, cards, spinners, modales. Sin lógica de negocio. |
| **components/layout/** | Header, Footer, Layout principal (con Outlet para las páginas). |
| **components/shared/** | ProductCard, CartBadge, etc. Reutilizados en varias páginas pero con lógica de dominio. |
| **pages/**      | Una carpeta por “pantalla” o flujo. Cada página exporta un componente por defecto. Nombrado `*Page.tsx` para distinguir de componentes. |
| **hooks/**      | Lógica reutilizable (useAuth, useCarrito, useProductos). Encapsulan llamadas a services + estado. |
| **services/**   | Solo llamadas HTTP a la API. Un archivo por dominio (productos, auth, carrito, pedidos, mascotas). `api.ts` = base URL y cliente común. |
| **types/**      | Interfaces TypeScript que reflejan los schemas del backend. |
| **contexts/**   | Auth (usuario logueado, token) y Carrito (ítems, total) para acceso global. |
| **constants/**  | Rutas (`/`, `/productos`, `/carrito`, etc.) para no repetir strings. |
| **utils/**      | Formateo de precios, fechas, validaciones simples. |

---

## Rutas sugeridas (constants/routes.ts)

```ts
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
```

---

## Convenciones

1. **Pages**: una carpeta por flujo (`auth`, `productos`, `carrito`, etc.), archivos `*Page.tsx`.
2. **Components**: `ui/` para genéricos, `layout/` para estructura, `shared/` para componentes de dominio reutilizables.
3. **Services**: un archivo por recurso del backend; usar `api.ts` para la base URL y opcionalmente interceptors (token, errores).
4. **Types**: nombres alineados con el backend (Producto, Usuario, ItemCarrito, Pedido, Mascota).
5. **Rutas**: centralizadas en `constants/routes.ts` y usadas en el router y en `Link`/`useNavigate`.

Con esta estructura podés escalar agregando nuevas páginas o dominios sin desorden, y mantener una correspondencia clara con la API.

---

## Área de administración

- **Rutas:** prefijo `/admin` (dashboard, pedidos, productos, usuarios, stock).
- **Protección:** `AdminRoute` exige usuario logueado y `rol === 'admin'`. Si no, redirige a login o home.
- **Layout:** `AdminLayout` con sidebar (Dashboard, Pedidos, Productos, Usuarios, Stock) y enlace "Ver sitio".
- **Header público:** si el usuario es admin, se muestra el enlace "Admin" que lleva a `/admin`.
- **Desarrollo:** para probar como admin sin depender del backend, definir `VITE_DEV_ADMIN=true` en `.env` del cliente; al iniciar sesión se asignará rol admin.
