import { Link } from 'react-router-dom';
import type { Producto } from '../../types/producto';
import { productDetailPath } from '../../constants/routes';
import { formatPrecio } from '../../utils/formatters';

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const precio = producto.precioPorKg ?? producto.precio_por_kg ?? 0;
  return (
    <article>
      <Link to={productDetailPath(String(producto.id))}>
        <h3>{producto.nombre}</h3>
        <p>{formatPrecio(precio)} / kg</p>
      </Link>
    </article>
  );
}
