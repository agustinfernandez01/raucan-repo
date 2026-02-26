from sqlalchemy.orm import Session, joinedload

import app.models.productos as models_producto
from app.schemas.productos import ProductoCreate, ProductoResponse, ProductoUpdate


def listar(db: Session, categoria_producto_id: int | None = None) -> list[ProductoResponse]:
    """Lista todos los productos (comida por kg)."""
    query = (
        db.query(models_producto.Productos)
        .options(joinedload(models_producto.Productos.categoria_producto))
    )
    if categoria_producto_id is not None:
        query = query.filter(models_producto.Productos.categoria_id == categoria_producto_id)
    return list(query.order_by(models_producto.Productos.nombre).all())


def obtener_producto_id(db: Session, producto_id: int):
    """Obtiene un producto por su id. Retorna None si no existe."""
    return (
        db.query(models_producto.Productos)
        .options(joinedload(models_producto.Productos.categoria_producto))
        .filter(models_producto.Productos.id == producto_id)
        .first()
    )


def crear_producto(db: Session, datos: ProductoCreate) -> ProductoResponse:
    """Crea un nuevo producto. Retorna el producto creado."""
    producto = models_producto.Productos(**datos.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


def actualizar_producto(db: Session, producto_id: int, datos: ProductoUpdate) -> ProductoResponse | None:
    """Actualiza un producto. Retorna el producto actualizado o None si no existe."""
    producto = obtener_producto_id(db, producto_id)
    if producto is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(producto, key, value)
    db.commit()
    return obtener_producto_id(db, producto_id)


def eliminar(db: Session, producto_id: int) -> bool:
    """Elimina un producto. Retorna True si existía y se eliminó, False si no existía."""
    producto = obtener_producto_id(db, producto_id)
    if producto is None:
        return False
    db.delete(producto)
    db.commit()
    return True
