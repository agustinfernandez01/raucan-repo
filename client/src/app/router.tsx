import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Layout from '../components/layout/Layout';
import AdminRoute from '../components/admin/AdminRoute';
import RequireAuth from '../components/auth/RequireAuth';
import AdminLayout from '../components/layout/AdminLayout';
import HomePage from '../pages/home/HomePage';
import RegisterPage from '../pages/auth/RegisterPage';
import LoginPage from '../pages/auth/LoginPage';
import ProductosPage from '../pages/productos/ProductosPage';
import ProductoDetailPage from '../pages/productos/ProductoDetailPage';
import CarritoPage from '../pages/carrito/CarritoPage';
import PedidosPage from '../pages/pedidos/PedidosPage';
import PedidoDetailPage from '../pages/pedidos/PedidoDetailPage';
import PerfilPage from '../pages/perfil/PerfilPage';
import MascotasPage from '../pages/perfil/MascotasPage';
import MascotaFormPage from '../pages/perfil/MascotaFormPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminPedidosPage from '../pages/admin/AdminPedidosPage';
import AdminPedidoDetailPage from '../pages/admin/AdminPedidoDetailPage';
import AdminProductosPage from '../pages/admin/AdminProductosPage';
import AdminUsuariosPage from '../pages/admin/AdminUsuariosPage';
import AdminStockPage from '../pages/admin/AdminStockPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.PRODUCTOS} replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'productos', element: <ProductosPage /> },
      { path: 'productos/:id', element: <ProductoDetailPage /> },
      { path: 'carrito', element: <CarritoPage /> },
      { path: 'pedidos', element: <PedidosPage /> },
      { path: 'pedidos/:id', element: <PedidoDetailPage /> },
      {
        path: 'perfil',
        element: <RequireAuth />,
        children: [
          { index: true, element: <PerfilPage /> },
          { path: 'mascotas', element: <MascotasPage /> },
          { path: 'mascotas/nueva', element: <MascotaFormPage /> },
          { path: 'mascotas/editar/:id', element: <MascotaFormPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'pedidos', element: <AdminPedidosPage /> },
          { path: 'pedidos/:id', element: <AdminPedidoDetailPage /> },
          { path: 'productos', element: <AdminProductosPage /> },
          { path: 'usuarios', element: <AdminUsuariosPage /> },
          { path: 'stock', element: <AdminStockPage /> },
        ],
      },
    ],
  },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
