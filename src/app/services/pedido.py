from sqlalchemy.orm import Session

from app.models import pedido as models_pedido
from app.schemas.pedido import PedidoCreate, PedidoUpdate


def listar_pedido(db: Session, usuario_id: int | None = None):
    """
    Lista pedidos. Si se pasa usuario_id, filtra por ese usuario.
    Si no, devuelve todos (útil para admin).
    """
    q = db.query(models_pedido.Pedido)
    if usuario_id is not None:
        q = q.filter(models_pedido.Pedido.usuario_id == usuario_id)
    return q.order_by(models_pedido.Pedido.creado_en.desc()).all()


def obtener_pedido_id(db: Session, pedido_id: int):
    """Obtiene un pedido por id (con detalles). Retorna None si no existe."""
    return (
        db.query(models_pedido.Pedido)
        .filter(models_pedido.Pedido.id == pedido_id)
        .first()
    )


def crear_pedido(db: Session, datos: PedidoCreate):
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


def actualizar_pedido(db: Session, pedido_id: int, datos: PedidoUpdate):
    """Actualiza estado y datos de un pedido. No modifica detalles."""
    pedido = obtener_pedido_id(db, pedido_id)
    if pedido is None:
        return None
    payload = datos.model_dump(exclude_unset=True)
    for key, value in payload.items():
        setattr(pedido, key, value)
    db.commit()
    db.refresh(pedido)
    return pedido


def eliminar_pedido(db: Session, pedido_id: int) -> bool:
    """Elimina un pedido (y sus detalles por cascade). Retorna True si existía."""
    pedido = obtener_pedido_id(db, pedido_id)
    if pedido is None:
        return False
    db.delete(pedido)
    db.commit()
    return True
