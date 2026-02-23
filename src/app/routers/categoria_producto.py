from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.categoria_producto import CategoriaProductoCreate, CategoriaProductoUpdate, CategoriaProductoResponse
from app.services import categoria_producto as svc_categoria_producto

router = APIRouter()

@router.get("/getcategorias", response_model=list[CategoriaProductoResponse])
def listar_categorias_productos(db: Session = Depends(get_db)):
    """Lista todas las categorías de productos."""
    return svc_categoria_producto.listar_categorias_productos(db)

@router.get("/getcategorias/{categoria_producto_id}", response_model=CategoriaProductoResponse)
def obtener_categoria_producto(categoria_producto_id: int, db: Session = Depends(get_db)):
    """Obtiene una categoría de producto por su ID."""
    categoria_producto = svc_categoria_producto.obtener_categoria_producto(db, categoria_producto_id)
    if categoria_producto is None:
        raise HTTPException(status_code=404, detail="Categoría de producto no encontrada")
    return categoria_producto

@router.post("/postcategorias", response_model=CategoriaProductoResponse)
def crear_categoria_producto(categoria_producto: CategoriaProductoCreate, db: Session = Depends(get_db)):
    """Crea una nueva categoría de producto."""
    return svc_categoria_producto.crear_categoria_producto(db, categoria_producto)

@router.put("/putcategorias/{categoria_producto_id}", response_model=CategoriaProductoResponse)
def actualizar_categoria_producto(categoria_producto_id: int, categoria_producto: CategoriaProductoUpdate, db: Session = Depends(get_db)):
    """Actualiza una categoría de producto."""
    return svc_categoria_producto.actualizar_categoria_producto(db, categoria_producto)

@router.delete("/deletecategorias/{categoria_producto_id}", response_model=CategoriaProductoResponse)
def eliminar_categoria_producto(categoria_producto_id: int, db: Session = Depends(get_db)):
    """Elimina una categoría de producto."""
    if not svc_categoria_producto.eliminar_categoria_producto(db, categoria_producto_id):
        raise HTTPException(status_code=404, detail="Categoría de producto no encontrada")
    return None