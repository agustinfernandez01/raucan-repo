import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

/**
 * Protege rutas que requieren sesión (ej. perfil, mascotas).
 * No redirige hasta haber comprobado el token (evita mandar al login al recargar).
 */
export default function RequireAuth() {
  const { isAuthenticated, authChecked } = useAuth();
  const location = useLocation();

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
