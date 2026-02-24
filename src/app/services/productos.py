from sqlalchemy.orm import Session, joinedload

import app.models.productos as models_producto
from app.schemas.productos import ProductoCreate, ProductoUpdate


<<<<<<< HEAD
def listar(db: Session, categoria_producto_id: int | None = None) -> list[ProductoResponse]:
    """Lista todos los productos (comida por kg)."""
    query = db.query(models_producto.Productos)
    if categoria_producto_id is not None:
        query = query.filter(models_producto.Productos.categoria_id == categoria_producto_id)
    return query.order_by(models_producto.Productos.nombre).all()


def obtener_producto_id(db: Session, producto_id: int) -> ProductoResponse | None:
=======
def listar(db: Session):
    """Lista todos los productos con su categoría."""
    return (
        db.query(models_producto.Producto)
        .options(joinedload(models_producto.Producto.categoria_rel))
        .all()
    )


def obtener_por_id(db: Session, producto_id: int):
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
    """Obtiene un producto por su id. Retorna None si no existe."""
    return (
        db.query(models_producto.Producto)
        .options(joinedload(models_producto.Producto.categoria_rel))
        .filter(models_producto.Producto.id == producto_id)
        .first()
    )


<<<<<<< HEAD
def crear_producto(db: Session, datos: ProductoCreate) -> ProductoResponse:
    """Crea un nuevo producto. Retorna el producto creado."""
    producto = models_producto.Productos(**datos.model_dump())
=======
def crear(db: Session, datos: ProductoCreate):
    """Crea un nuevo producto."""
    producto = models_producto.Producto(**datos.model_dump())
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return producto


<<<<<<< HEAD
def actualizar_producto(db: Session, producto_id: int, datos: ProductoUpdate) -> ProductoResponse:
=======
def actualizar(db: Session, producto_id: int, datos: ProductoUpdate):
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
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
