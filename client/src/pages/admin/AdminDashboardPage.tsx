import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../constants/routes';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to={ADMIN_ROUTES.PEDIDOS}
          className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300"
        >
          <h2 className="font-medium text-slate-800">Pedidos</h2>
          <p className="text-sm text-slate-500 mt-1">Ver y gestionar pedidos</p>
        </Link>
        <Link
          to={ADMIN_ROUTES.PRODUCTOS}
          className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300"
        >
          <h2 className="font-medium text-slate-800">Productos</h2>
          <p className="text-sm text-slate-500 mt-1">Catálogo y precios</p>
        </Link>
        <Link
          to={ADMIN_ROUTES.USUARIOS}
          className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300"
        >
          <h2 className="font-medium text-slate-800">Usuarios</h2>
          <p className="text-sm text-slate-500 mt-1">Clientes y cuentas</p>
        </Link>
        <Link
          to={ADMIN_ROUTES.STOCK}
          className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300"
        >
          <h2 className="font-medium text-slate-800">Stock</h2>
          <p className="text-sm text-slate-500 mt-1">Inventario por producto</p>
        </Link>
      </div>
    </div>
  );
}
