from sqlalchemy.orm import Session

from app.models import producto as models_producto
from app.schemas.producto import ProductoCreate, ProductoUpdate


def listar(db: Session):
    """Lista todos los productos (comida por kg)."""
    return db.query(models_producto.Producto).all()


def obtener_por_id(db: Session, producto_id: int):
    """Obtiene un producto por su id. Retorna None si no existe."""
    return db.query(models_producto.Producto).filter(
        models_producto.Producto.id == producto_id
    ).first()


def crear(db: Session, datos: ProductoCreate):
    """Crea un nuevo producto."""
    producto = models_producto.Producto(**datos.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


def actualizar(db: Session, producto_id: int, datos: ProductoUpdate):
    """Actualiza un producto. Retorna el producto actualizado o None si no existe."""
    producto = obtener_por_id(db, producto_id)
    if producto is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto


def eliminar(db: Session, producto_id: int) -> bool:
    """Elimina un producto. Retorna True si existía y se eliminó, False si no existía."""
    producto = obtener_por_id(db, producto_id)
    if producto is None:
        return False
    db.delete(producto)
    db.commit()
    return True
