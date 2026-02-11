from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas.stock_deposito import StockDepositoResponse, StockDepositoCreate, StockDepositoUpdate, StockDepositoPatch
from app.services import stock_deposito as svc_stock_deposito

router = APIRouter()

# listar todos los depositos (GET)
@router.get("/get", response_model=list[StockDepositoResponse])
def listar_depositos(db: Session = Depends(get_db)):
    try:
        return svc_stock_deposito.listar_depositos(db)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener los depositos"
        )

# obtener un deposito por id (GET)
@router.get("/get/{id}", response_model=StockDepositoResponse)
def obtener_inventario_por_id(id: int, db: Session = Depends(get_db)):
    try:
        return svc_stock_deposito.obtener_deposito_por_id(db, id)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener el inventario"
        )

# crear un deposito (POST)
@router.post("/create", response_model=StockDepositoResponse)
def crear_deposito(deposito: StockDepositoCreate, db: Session = Depends(get_db)):
    try:
        return svc_stock_deposito.crear_deposito(db, deposito)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al crear el deposito"
        )

# actualizar un deposito (PUT)
@router.put("/update/{id}", response_model=StockDepositoResponse)
def actualizar_deposito(id: int, deposito: StockDepositoUpdate, db: Session = Depends(get_db)):
    try:
        return svc_stock_deposito.actualizar_deposito(db, id, deposito)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al actualizar el deposito"
        )
        
# actualizar un inventario parcialmente (PATCH)
@router.patch("/patch/{id}", response_model=StockDepositoResponse)
def actualizar_deposito_parcial(id: int, deposito: StockDepositoPatch, db: Session = Depends(get_db)):
    try:
        return svc_stock_deposito.actualizar_deposito_parcial(db, id, deposito)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al actualizar el deposito parcialmente"
        )
        
# eliminar un deposito (DELETE)   
@router.delete("/delete/{id}", response_model=StockDepositoResponse)
def eliminar_deposito(id: int, db: Session = Depends(get_db)):
    try:
        return svc_stock_deposito.eliminar_deposito(db, id)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al eliminar el deposito"
        )
        
