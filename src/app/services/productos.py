from sqlalchemy.orm import Session

from app.models import producto as models_producto


def listar(db: Session):
    """Lista todos los productos (comida por kg)."""
    return db.query(models_producto.Producto).all()
