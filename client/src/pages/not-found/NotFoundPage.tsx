import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFoundPage() {
  return (
    <main>
      <h1>Página no encontrada</h1>
      <Link to={ROUTES.HOME}>Volver al inicio</Link>
    </main>
  );
}
