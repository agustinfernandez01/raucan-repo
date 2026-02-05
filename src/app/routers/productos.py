from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.producto import ProductoResponse
from app.services import productos as svc_productos

router = APIRouter()


@router.get("/", response_model=list[ProductoResponse])
def listar_productos(db: Session = Depends(get_db)):
    """Lista productos (comida por kg)."""
    return svc_productos.listar(db)
