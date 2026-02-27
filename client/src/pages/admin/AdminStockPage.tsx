// MOSTRAR STOCK EN TABLA
// FILTRAR POR PRODUCTO
// FILTRAR POR DEPOSITO
// BUSCAR POR NOMBRE O DESCRIPCION
// PAGINAR
// ORDENAR POR NOMBRE, CANTIDAD, DEPOSITO
// MOSTRAR CANTIDAD DE PRODUCTOS, DEPOSITOS
// MOSTRAR CANTIDAD DE PRODUCTOS POR DEPOSITO
// MOSTRAR CANTIDAD DE PRODUCTOS POR PRODUCTO Y DEPOSITO
export default function AdminStockPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Stock</h1>
      <p className="text-slate-600">
        Inventario por producto (depósito). Conectar con el endpoint de stock/depósito del backend
        cuando esté disponible.
      </p>
    </div>
  );
}
