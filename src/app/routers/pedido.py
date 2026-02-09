from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.pedido import (
    PedidoCreate,
    PedidoConDetallesResponse,
    PedidoDetalleCreate,
    PedidoDetalleResponse,
    PedidoResponse,
    PedidoUpdate,
    PedidoDetalleUpdate,
)
from app.services import pedido as svc_pedido

router = APIRouter()


@router.get("/", response_model=list[PedidoResponse])
def listar_pedidos(
    usuario_id: int | None = Query(None, description="Filtrar por usuario"),
    db: Session = Depends(get_db),
):
    """Lista pedidos. Sin usuario_id: todos; con usuario_id: solo los de ese usuario."""
    return svc_pedido.listar(db, usuario_id=usuario_id)


@router.get("/{pedido_id}", response_model=PedidoConDetallesResponse)
def obtener_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """Obtiene un pedido por id con sus detalles."""
    pedido = svc_pedido.obtener_por_id(db, pedido_id)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


@router.post("/", response_model=PedidoConDetallesResponse, status_code=201)
def crear_pedido(datos: PedidoCreate, db: Session = Depends(get_db)):
    """Crea un pedido con sus ítems. El total se calcula automáticamente."""
    if not datos.detalles:
        raise HTTPException(
            status_code=400, detail="El pedido debe tener al menos un detalle"
        )
    pedido = svc_pedido.crear(db, datos)
    return pedido


@router.patch("/{pedido_id}", response_model=PedidoResponse)
def actualizar_pedido(
    pedido_id: int, datos: PedidoUpdate, db: Session = Depends(get_db)
):
    """Actualiza estado y datos de un pedido (no modifica los ítems)."""
    pedido = svc_pedido.actualizar(db, pedido_id, datos)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return pedido


@router.delete("/{pedido_id}", status_code=204)
def eliminar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """Elimina un pedido y sus detalles."""
    if not svc_pedido.eliminar(db, pedido_id):
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return None


# --- Detalle del pedido (rutas anidadas) ---


@router.get(
    "/{pedido_id}/detalles",
    response_model=list[PedidoDetalleResponse],
)
def listar_detalles_pedido(pedido_id: int, db: Session = Depends(get_db)):
    """Lista los ítems (detalles) de un pedido."""
    detalles = svc_pedido.listar_detalles(db, pedido_id)
    if detalles is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return detalles


@router.get(
    "/{pedido_id}/detalles/{detalle_id}",
    response_model=PedidoDetalleResponse,
)
def obtener_detalle_pedido(
    pedido_id: int, detalle_id: int, db: Session = Depends(get_db)
):
    """Obtiene un ítem del detalle por id."""
    detalle = svc_pedido.obtener_detalle_por_id(db, pedido_id, detalle_id)
    if detalle is None:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle


@router.post(
    "/{pedido_id}/detalles",
    response_model=PedidoDetalleResponse,
    status_code=201,
)
def agregar_detalle_pedido(
    pedido_id: int, datos: PedidoDetalleCreate, db: Session = Depends(get_db)
):
    """Agrega un ítem al pedido. Se recalcula el total automáticamente."""
    detalle = svc_pedido.agregar_detalle(db, pedido_id, datos)
    if detalle is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return detalle


@router.patch(
    "/{pedido_id}/detalles/{detalle_id}",
    response_model=PedidoDetalleResponse,
)
def actualizar_detalle_pedido(
    pedido_id: int,
    detalle_id: int,
    datos: PedidoDetalleUpdate,
    db: Session = Depends(get_db),
):
    """Actualiza cantidad o precio de un ítem. Se recalculan subtotal y total."""
    detalle = svc_pedido.actualizar_detalle(db, pedido_id, detalle_id, datos)
    if detalle is None:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle


@router.delete("/{pedido_id}/detalles/{detalle_id}", status_code=204)
def eliminar_detalle_pedido(
    pedido_id: int, detalle_id: int, db: Session = Depends(get_db)
):
    """Elimina un ítem del pedido. Se recalcula el total."""
    if not svc_pedido.eliminar_detalle(db, pedido_id, detalle_id):
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return None
