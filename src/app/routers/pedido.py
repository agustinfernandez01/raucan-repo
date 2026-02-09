from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.pedido import (
    PedidoCreate,
    PedidoConDetallesResponse,
    PedidoResponse,
    PedidoUpdate,
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
