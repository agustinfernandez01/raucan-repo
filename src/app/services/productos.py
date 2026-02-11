from sqlalchemy.orm import Session

import app.models.productos as models_producto
from app.schemas.productos import ProductoCreate, ProductoUpdate, ProductoResponse


def listar(db: Session):
    """Lista todos los productos (comida por kg)."""
    return db.query(models_producto.Productos).all()


def obtener_producto_id(db: Session, producto_id: int):
    """Obtiene un producto por su id. Retorna None si no existe."""
    return db.query(models_producto.Productos).filter(
        models_producto.Productos.id == producto_id
    ).first()


def crear_producto(db: Session, datos: ProductoCreate):
    """Crea un nuevo producto."""
    producto = models_producto.Productos(**datos.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


def actualizar_producto(db: Session, producto_id: int, datos: ProductoUpdate):
    """Actualiza un producto. Retorna el producto actualizado o None si no existe."""
    producto = obtener_producto_id(db, producto_id)
    if producto is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(producto, key, value)
    db.commit()
    db.refresh(producto)
    return producto


def eliminar_producto(db: Session, producto_id: int) -> bool:
    """Elimina un producto. Retorna True si existía y se eliminó, False si no existía."""
    producto = obtener_producto_id(db, producto_id)
    if producto is None:
        return False
    db.delete(producto)
    db.commit()
    return True
