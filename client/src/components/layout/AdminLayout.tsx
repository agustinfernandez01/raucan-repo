import { Link, Outlet, useLocation } from 'react-router-dom';
import { ADMIN_ROUTES, ROUTES } from '../../constants/routes';

const navItems = [
  { to: ADMIN_ROUTES.DASHBOARD, label: 'Dashboard' },
  { to: ADMIN_ROUTES.PEDIDOS, label: 'Pedidos' },
  { to: ADMIN_ROUTES.PRODUCTOS, label: 'Productos' },
  { to: ADMIN_ROUTES.USUARIOS, label: 'Usuarios' },
  { to: ADMIN_ROUTES.STOCK, label: 'Stock' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-slate-800 text-white">
        <div className="p-4 border-b border-slate-700">
          <Link to={ADMIN_ROUTES.DASHBOARD} className="font-semibold block">
            Raucan Admin
          </Link>
          <Link
            to={ROUTES.HOME}
            className="mt-2 text-sm text-slate-300 hover:text-white"
          >
            Ver sitio
          </Link>
        </div>
        <nav className="p-2 flex flex-col gap-1">
          {navItems.map(({ to, label }) => {
            const active =
              location.pathname === to ||
              (to !== ADMIN_ROUTES.DASHBOARD && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`rounded px-3 py-2 text-sm ${
                  active ? 'bg-slate-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
