from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.carrito import CarritoCreate, CarritoResponse, CarritoUpdate
from app.services import carrito as svc_carrito

router = APIRouter()


@router.get("/", response_model=list[CarritoResponse])
def listar_carrito(
    usuario_id: int = Query(..., description="ID del usuario"),
    db: Session = Depends(get_db),
):
    """Lista todos los ítems del carrito de un usuario."""
    return svc_carrito.listar_por_usuario(db, usuario_id)


@router.get("/{item_id}", response_model=CarritoResponse)
def obtener_item(item_id: int, db: Session = Depends(get_db)):
    """Obtiene un ítem del carrito por id."""
    item = svc_carrito.obtener_por_id(db, item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Ítem no encontrado")
    return item


@router.post("/", response_model=CarritoResponse, status_code=201)
def agregar_al_carrito(datos: CarritoCreate, db: Session = Depends(get_db)):
    """Agrega un ítem al carrito (o suma cantidad si ya existe el producto)."""
    item = svc_carrito.agregar(db, datos)
    if item is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return item


@router.patch("/{item_id}", response_model=CarritoResponse)
def actualizar_item(
    item_id: int, datos: CarritoUpdate, db: Session = Depends(get_db)
):
    """Actualiza la cantidad (y opcionalmente precio) de un ítem del carrito."""
    item = svc_carrito.actualizar(db, item_id, datos)
    if item is None:
        raise HTTPException(status_code=404, detail="Ítem no encontrado")
    return item


@router.delete("/", status_code=204)
def vaciar_carrito(
    usuario_id: int = Query(..., description="ID del usuario"),
    db: Session = Depends(get_db),
):
    """Vacía todo el carrito de un usuario."""
    svc_carrito.vaciar_usuario(db, usuario_id)
    return None


@router.delete("/{item_id}", status_code=204)
def quitar_del_carrito(item_id: int, db: Session = Depends(get_db)):
    """Elimina un ítem del carrito."""
    if not svc_carrito.eliminar(db, item_id):
        raise HTTPException(status_code=404, detail="Ítem no encontrado")
    return None
