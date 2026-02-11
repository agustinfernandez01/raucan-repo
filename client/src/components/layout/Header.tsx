import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function Header() {
  return (
    <header>
      <nav>
        <Link to={ROUTES.HOME}>Raucan</Link>
        <Link to={ROUTES.PRODUCTOS}>Productos</Link>
        <Link to={ROUTES.CARRITO}>Carrito</Link>
        <Link to={ROUTES.LOGIN}>Entrar</Link>
      </nav>
    </header>
  );
}
