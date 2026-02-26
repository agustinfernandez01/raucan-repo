import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '../../constants/routes';

const panelItems = [
  { to: ADMIN_ROUTES.DASHBOARD, label: 'Dashboard', description: 'Resumen y accesos rápidos' },
  { to: ADMIN_ROUTES.PEDIDOS, label: 'Pedidos', description: 'Ver y gestionar pedidos' },
  { to: ADMIN_ROUTES.PRODUCTOS, label: 'Productos', description: 'Catálogo y precios' },
  { to: ADMIN_ROUTES.USUARIOS, label: 'Usuarios', description: 'Clientes y cuentas' },
  { to: ADMIN_ROUTES.STOCK, label: 'Stock', description: 'Inventario por producto' },
];

export default function AdminPanelPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {panelItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
          >
            <h2 className="font-medium text-slate-800">{item.label}</h2>
            <p className="text-sm text-slate-500 mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
