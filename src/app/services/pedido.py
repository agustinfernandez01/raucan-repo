from sqlalchemy.orm import Session

from app.models import pedido as models_pedido
from app.schemas.pedido import (
    PedidoCreate,
    PedidoDetalleCreate,
    PedidoDetalleUpdate,
    PedidoUpdate,
)


def listar(db: Session, usuario_id: int | None = None):
    """
    Lista pedidos. Si se pasa usuario_id, filtra por ese usuario.
    Si no, devuelve todos (útil para admin).
    """
    q = db.query(models_pedido.Pedido)
    if usuario_id is not None:
        q = q.filter(models_pedido.Pedido.usuario_id == usuario_id)
    return q.order_by(models_pedido.Pedido.creado_en.desc()).all()


def obtener_por_id(db: Session, pedido_id: int):
    """Obtiene un pedido por id (con detalles). Retorna None si no existe."""
    return (
        db.query(models_pedido.Pedido)
        .filter(models_pedido.Pedido.id == pedido_id)
        .first()
    )


def crear(db: Session, datos: PedidoCreate):
    """
    Crea un pedido con sus detalles. Calcula total y subtotales
    a partir de cantidad_kg * precio_por_kg de cada ítem.
    """
    total = 0.0
    for d in datos.detalles:
        total += d.cantidad_kg * d.precio_por_kg

    pedido = models_pedido.Pedido(
        usuario_id=datos.usuario_id,
        estado="pendiente",
        total=round(total, 2),
        direccion_entrega=datos.direccion_entrega,
        mensaje_enviado=datos.mensaje_enviado,
        canal_mensaje=datos.canal_mensaje,
        notas_internas=datos.notas_internas,
    )
    db.add(pedido)
    db.flush()  # para tener pedido.id antes de crear detalles

    for d in datos.detalles:
        subtotal = round(d.cantidad_kg * d.precio_por_kg, 2)
        detalle = models_pedido.PedidoDetalle(
            pedido_id=pedido.id,
            producto_id=d.producto_id,
            cantidad_kg=d.cantidad_kg,
            precio_por_kg=d.precio_por_kg,
            subtotal=subtotal,
        )
        db.add(detalle)

    db.commit()
    db.refresh(pedido)
    return pedido


def actualizar(db: Session, pedido_id: int, datos: PedidoUpdate):
    """Actualiza estado y datos de un pedido. No modifica detalles."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(pedido, key, value)
    db.commit()
    db.refresh(pedido)
    return pedido


def eliminar(db: Session, pedido_id: int) -> bool:
    """Elimina un pedido (y sus detalles por cascade). Retorna True si existía."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return False
    db.delete(pedido)
    db.commit()
    return True


# --- Detalle del pedido ---


def _recalcular_total_pedido(db: Session, pedido: models_pedido.Pedido) -> None:
    """Recalcula pedido.total con la suma de subtotales de sus detalles."""
    total = sum(
        (d.subtotal or (d.cantidad_kg * d.precio_por_kg))
        for d in pedido.detalles
    )
    pedido.total = round(total, 2)


def listar_detalles(db: Session, pedido_id: int):
    """Lista los detalles de un pedido. Retorna lista vacía si el pedido no existe."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return None
    return list(pedido.detalles)


def obtener_detalle_por_id(db: Session, pedido_id: int, detalle_id: int):
    """Obtiene un detalle por pedido_id y detalle_id. Retorna None si no existe."""
    return (
        db.query(models_pedido.PedidoDetalle)
        .filter(
            models_pedido.PedidoDetalle.pedido_id == pedido_id,
            models_pedido.PedidoDetalle.id == detalle_id,
        )
        .first()
    )


def agregar_detalle(db: Session, pedido_id: int, datos: PedidoDetalleCreate):
    """Agrega un ítem al pedido y recalcula el total. Retorna el detalle o None si el pedido no existe."""
    pedido = obtener_por_id(db, pedido_id)
    if pedido is None:
        return None
    subtotal = round(datos.cantidad_kg * datos.precio_por_kg, 2)
    detalle = models_pedido.PedidoDetalle(
        pedido_id=pedido_id,
        producto_id=datos.producto_id,
        cantidad_kg=datos.cantidad_kg,
        precio_por_kg=datos.precio_por_kg,
        subtotal=subtotal,
    )
    db.add(detalle)
    db.flush()
    _recalcular_total_pedido(db, pedido)
    db.commit()
    db.refresh(detalle)
    return detalle


def actualizar_detalle(
    db: Session, pedido_id: int, detalle_id: int, datos: PedidoDetalleUpdate
):
    """Actualiza cantidad/precio de un detalle, recalcula subtotal y total del pedido."""
    detalle = obtener_detalle_por_id(db, pedido_id, detalle_id)
    if detalle is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(detalle, key, value)
    detalle.subtotal = round(detalle.cantidad_kg * detalle.precio_por_kg, 2)
    pedido = obtener_por_id(db, pedido_id)
    _recalcular_total_pedido(db, pedido)
    db.commit()
    db.refresh(detalle)
    return detalle


def eliminar_detalle(db: Session, pedido_id: int, detalle_id: int) -> bool:
    """Elimina un detalle y recalcula el total del pedido. Retorna True si existía."""
    detalle = obtener_detalle_por_id(db, pedido_id, detalle_id)
    if detalle is None:
        return False
    pedido = obtener_por_id(db, pedido_id)
    db.delete(detalle)
    _recalcular_total_pedido(db, pedido)
    db.commit()
    return True
