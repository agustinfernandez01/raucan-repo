export default function AdminUsuariosPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Usuarios</h1>
      <p className="text-slate-600">
        Listado y gestión de usuarios. Conectar con GET /usuarios/get-usuarios cuando el backend
        restrinja por rol admin.
      </p>
    </div>
  );
}
