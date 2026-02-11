from sqlalchemy.orm import Session

from app.models import carrito as models_carrito
import app.models.productos as models_producto
from app.schemas.carrito import CarritoCreate, CarritoUpdate


def listar_items_usuario(db: Session, usuario_id: int):
    """Lista todos los ítems del carrito de un usuario."""
    return (
        db.query(models_carrito.Carrito)
        .filter(models_carrito.Carrito.usuario_id == usuario_id)
        .all()
    )


def obtener_item_id(db: Session, item_id: int):
    """Obtiene un ítem del carrito por id. Retorna None si no existe."""
    return (
        db.query(models_carrito.Carrito)
        .filter(models_carrito.Carrito.id == item_id)
        .first()
    )


def buscar_item_usuario_producto(db: Session, usuario_id: int, producto_id: int):
    """Busca un ítem del carrito por usuario y producto. Retorna None si no existe."""
    return (
        db.query(models_carrito.Carrito)
        .filter(
            models_carrito.Carrito.usuario_id == usuario_id,
            models_carrito.Carrito.producto_id == producto_id,
        )
        .first()
    )


def agregar_item(db: Session, datos: CarritoCreate):
    """
    Agrega un ítem al carrito. Si ya existe ese producto para el usuario,
    suma la cantidad. Si no, crea un nuevo ítem. Opcionalmente guarda precio_por_kg
    del producto si no se envía.
    """
    producto = (
        db.query(models_producto.Productos)
        .filter(models_producto.Productos.id == datos.producto_id)
        .first()
    )
    if producto is None:
        return None

    existente = buscar_item_usuario_producto(db, datos.usuario_id, datos.producto_id)
    precio = datos.precio_por_kg if datos.precio_por_kg is not None else producto.precio_por_kg

    if existente:
        existente.cantidad_kg += datos.cantidad_kg
        if precio is not None:
            existente.precio_por_kg = precio
        db.commit()
        db.refresh(existente)
        return existente

    item = models_carrito.Carrito(
        usuario_id=datos.usuario_id,
        producto_id=datos.producto_id,
        cantidad_kg=datos.cantidad_kg,
        precio_por_kg=precio,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def actualizar_item(db: Session, item_id: int, datos: CarritoUpdate):
    """Actualiza cantidad (y opcionalmente precio) de un ítem. Retorna el ítem o None."""
    item = obtener_item_id(db, item_id)
    if item is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def eliminar_item(db: Session, item_id: int) -> bool:
    """Elimina un ítem del carrito. Retorna True si existía, False si no."""
    item = obtener_item_id(db, item_id)
    if item is None:
        return False
    db.delete(item)
    db.commit()
    return True


def vaciar_carrito(db: Session, usuario_id: int) -> int:
    """Elimina todos los ítems del carrito de un usuario. Retorna cantidad eliminada."""
    deleted = (
        db.query(models_carrito.Carrito)
        .filter(models_carrito.Carrito.usuario_id == usuario_id)
        .delete()
    )
    db.commit()
    return deleted
