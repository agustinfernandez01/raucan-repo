import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/home/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProductosPage from '../pages/productos/ProductosPage';
import ProductoDetailPage from '../pages/productos/ProductoDetailPage';
import CarritoPage from '../pages/carrito/CarritoPage';
import PedidosPage from '../pages/pedidos/PedidosPage';
import PedidoDetailPage from '../pages/pedidos/PedidoDetailPage';
import PerfilPage from '../pages/perfil/PerfilPage';
import MascotasPage from '../pages/perfil/MascotasPage';
import NotFoundPage from '../pages/not-found/NotFoundPage';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'registro', element: <RegisterPage /> },
      { path: 'productos', element: <ProductosPage /> },
      { path: 'productos/:id', element: <ProductoDetailPage /> },
      { path: 'carrito', element: <CarritoPage /> },
      { path: 'pedidos', element: <PedidosPage /> },
      { path: 'pedidos/:id', element: <PedidoDetailPage /> },
      { path: 'perfil', element: <PerfilPage /> },
      { path: 'perfil/mascotas', element: <MascotasPage /> },
    ],
  },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
