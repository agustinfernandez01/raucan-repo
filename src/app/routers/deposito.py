from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
#services
from app.services import deposito as svc_deposito
#schemas
from app.schemas.deposito import DepositoResponse, DepositoCreate, DepositoUpdate, DepositoPatch

router = APIRouter()

# listar todos los depositos (GET)
@router.get("/get", response_model=list[DepositoResponse])
def listar_depositos(db: Session = Depends(get_db)):
    try:
        return svc_deposito.listar_depositos(db)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener los depósitos"
        )

# obtener un deposito por su id (GET)
@router.get("/get/{deposito_id}", response_model=DepositoResponse)
def obtener_deposito(deposito_id: int, db: Session = Depends(get_db)):
    try:
        return svc_deposito.obtener_deposito_por_id(db, deposito_id)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al obtener el depósito"
        )

# crear un nuevo deposito (POST)
@router.post("/post", response_model=DepositoResponse)
def post_deposito(deposito: DepositoCreate, db: Session = Depends(get_db)):
    try:
        return svc_deposito.crear_deposito(db, deposito)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al crear el depósito"
        )

# actualizar un deposito totalmente (PUT)
@router.put("/put/{deposito_id}", response_model=DepositoResponse)
def put_deposito(deposito_id: int, deposito: DepositoUpdate, db: Session = Depends(get_db)):
    try:
        return svc_deposito.actualizar_deposito(db, deposito_id, deposito)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al actualizar el depósito"
        )

@router.patch("/patch/{deposito_id}", response_model=DepositoResponse)
def patch_deposito(deposito_id: int, deposito: DepositoPatch, db: Session = Depends(get_db)):
    try:
        return svc_deposito.actualizar_deposito_parcial(db, deposito_id, deposito)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al actualizar el depósito"
        )

# eliminar un deposito (DELETE)
@router.delete("/delete/{deposito_id}", response_model=DepositoResponse)
def delete_deposito(deposito_id: int, db: Session = Depends(get_db)):
    try:
        return svc_deposito.eliminar_deposito(db, deposito_id)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Error al eliminar el depósito"
        )

        
        
        