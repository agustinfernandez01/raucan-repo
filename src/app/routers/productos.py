from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.productos import ProductoCreate, ProductoResponse, ProductoUpdate
from app.services import productos as svc_productos

router = APIRouter()


@router.get("/getproductos", response_model=list[ProductoResponse])
def listar_productos(
    categoria_producto_id: int | None = None,
    db: Session = Depends(get_db)
):
    return svc_productos.listar(db, categoria_producto_id)


@router.get("/getproductos/{producto_id}", response_model=ProductoResponse)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    """Obtiene un producto por id."""
    producto = svc_productos.obtener_producto_id(db, producto_id)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.post("/postproductos", response_model=ProductoResponse, status_code=201)
def crear_producto(datos: ProductoCreate, db: Session = Depends(get_db)):
    """Crea un nuevo producto."""
    return svc_productos.crear_producto(db, datos)


@router.patch("/patchproductos/{producto_id}", response_model=ProductoResponse)
def actualizar_producto(
    producto_id: int, datos: ProductoUpdate, db: Session = Depends(get_db)
):
    """Actualiza un producto (campos opcionales)."""
    producto = svc_productos.actualizar_producto(db, producto_id, datos)
    if producto is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.delete("/deleteproductos/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    """Elimina un producto."""
    if not svc_productos.eliminar(db, producto_id):
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return None
