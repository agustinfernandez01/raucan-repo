import { useParams } from 'react-router-dom';

export default function PedidoDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <main>
      <h1>Pedido #{id}</h1>
      {/* Detalle del pedido */}
    </main>
  );
}
