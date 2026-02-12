import { useParams } from 'react-router-dom';

export default function ProductoDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <main>
      <h1>Detalle del producto {id}</h1>
      {/* Detalle y agregar al carrito */}
    </main>
  );
}
