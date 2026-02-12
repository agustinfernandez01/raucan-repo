import { Link } from 'react-router-dom';
import { ROUTES, ADMIN_ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useCarrito } from '../../contexts/CarritoContext';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCarrito();

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="flex items-center gap-6 px-4 py-3 max-w-6xl mx-auto">
        <Link to={ROUTES.HOME} className="font-semibold text-slate-800">
          Raucan
        </Link>
        <Link to={ROUTES.PRODUCTOS} className="text-slate-600 hover:text-slate-900">
          Productos
        </Link>
        <Link to={ROUTES.CARRITO} className="text-slate-600 hover:text-slate-900">
          Carrito {totalItems > 0 && `(${totalItems} kg)`}
        </Link>
        {isAdmin && (
          <Link to={ADMIN_ROUTES.DASHBOARD} className="text-amber-600 hover:text-amber-700 font-medium">
            Admin
          </Link>
        )}
        {isAuthenticated ? (
          <>
            <Link to={ROUTES.PERFIL} className="text-slate-600 hover:text-slate-900">
              {user?.nombre ?? user?.email ?? 'Mi cuenta'}
            </Link>
            <button type="button" onClick={logout} className="text-slate-600 hover:text-slate-900 text-sm">
              Salir
            </button>
          </>
        ) : (
          <Link to={ROUTES.LOGIN} className="text-slate-600 hover:text-slate-900">
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
