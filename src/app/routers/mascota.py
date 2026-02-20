from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.schemas.mascota import MascotaCreate, MascotaResponse, MascotaUpdate
from app.services import mascota as svc_mascota

router = APIRouter()


@router.get("/", response_model=list[MascotaResponse])
def listar_mascotas(
    usuario_id: int | None = Query(None, description="Filtrar por usuario"),
    db: Session = Depends(get_db),
):
    """Lista mascotas. Sin usuario_id: todas; con usuario_id: solo las de ese usuario."""
    return svc_mascota.listar_mascota(db, usuario_id=usuario_id)


@router.get("/{mascota_id}", response_model=MascotaResponse)
def obtener_mascota(mascota_id: int, db: Session = Depends(get_db)):
    """Obtiene una mascota por id."""
    mascota = svc_mascota.obtener_mascota_id(db, mascota_id)
    if mascota is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return mascota


@router.post("/", response_model=MascotaResponse, status_code=201)
def crear_mascota(datos: MascotaCreate, db: Session = Depends(get_db)):
    """Crea una nueva mascota."""
    return svc_mascota.crear_mascota(db, datos)


@router.patch("/{mascota_id}", response_model=MascotaResponse)
def actualizar_mascota(
    mascota_id: int, datos: MascotaUpdate, db: Session = Depends(get_db)
):
    """Actualiza una mascota (campos opcionales)."""
    mascota = svc_mascota.actualizar_mascota(db, mascota_id, datos)
    if mascota is None:
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return mascota


@router.delete("/{mascota_id}", status_code=204)
def eliminar_mascota(mascota_id: int, db: Session = Depends(get_db)):
    """Elimina una mascota."""
    if not svc_mascota.eliminar_mascota(db, mascota_id):
        raise HTTPException(status_code=404, detail="Mascota no encontrada")
    return None
