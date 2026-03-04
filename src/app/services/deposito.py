from sqlalchemy.orm import Session
from app.models.deposito import Deposito as ModelDeposito
from app.schemas.deposito import DepositoResponse, DepositoCreate, DepositoUpdate, DepositoPatch
from datetime import datetime
from fastapi import HTTPException, status



#listar todos los depositos (GET)
def listar_depositos(db: Session) -> list[ModelDeposito]:
    listado_depositos = db.query(ModelDeposito).all() #type: ignore
    if not listado_depositos:
        raise ValueError("No se encontraron depositos")
    return listado_depositos

#obtener un deposito por su id (GET)
def obtener_deposito_por_id(db: Session, deposito_id: int) -> DepositoResponse:
    deposito = db.query(ModelDeposito).filter(ModelDeposito.id == deposito_id).first()
    if not deposito:
        raise ValueError("No se encontró el deposito")
    return DepositoResponse(**deposito.model_dump())

#crear un nuevo deposito (POST)
def crear_deposito(db: Session, deposito: DepositoCreate) -> DepositoResponse:
    existe = db.query(ModelDeposito).filter(ModelDeposito.nombre == deposito.nombre).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El depósito ya existe"
        )

    nuevo = ModelDeposito(
        nombre=deposito.nombre,
        descripcion=deposito.descripcion,
        direccion=deposito.direccion,
        ubicacion=deposito.ubicacion,
        estado=True
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

#actualizar un deposito parcialmente (PATCH)
def actualizar_deposito_parcial(db: Session, deposito_id: int, deposito: DepositoPatch) -> DepositoResponse:
    deposito_actual = db.query(ModelDeposito).filter(ModelDeposito.id == deposito_id).first()
    if not deposito_actual:
        raise ValueError("No se encontró el deposito")

    data = deposito.model_dump(exclude_unset=True)

    # validar nombre único solo si viene y cambia
    if "nombre" in data and data["nombre"] != deposito_actual.nombre:
        existe_deposito = db.query(ModelDeposito).filter(
            ModelDeposito.nombre == data["nombre"],
            Deposito.id != deposito_id
        ).first()
        if existe_deposito:
            raise ValueError("El deposito ya existe")

    # aplicar cambios
    for key, value in data.items():
        setattr(deposito_actual, key, value)

    deposito_actual.actualizado_en = datetime.now()
    db.commit()
    db.refresh(deposito_actual)
    return deposito_actual

#actualizar un deposito totalmente (PUT)
def actualizar_deposito(db: Session, deposito_id: int, deposito: DepositoUpdate) -> DepositoResponse:
    deposito_actual = db.query(ModelDeposito).filter(ModelDeposito.id == deposito_id).first()
    if not deposito_actual:
        raise ValueError("No se encontró el deposito")

    # validar nombre único solo si cambia
    if deposito.nombre != deposito_actual.nombre:
        existe = db.query(ModelDeposito).filter(
            ModelDeposito.nombre == deposito.nombre,
            Deposito.id != deposito_id
        ).first()
        if existe:
            raise ValueError("Ya existe un deposito con ese nombre")

    deposito_actual.nombre = deposito.nombre
    deposito_actual.descripcion = deposito.descripcion
    deposito_actual.direccion = deposito.direccion
    deposito_actual.ubicacion = deposito.ubicacion
    deposito_actual.estado = deposito.estado
    deposito_actual.actualizado_en = datetime.now()

    db.commit()
    db.refresh(deposito_actual)
    return deposito_actual


#eliminar un deposito
def eliminar_deposito(db: Session, deposito_id: int) -> tuple[bool, str]:
    deposito_actual = db.query(ModelDeposito).filter(ModelDeposito.id == deposito_id).first()
    if not deposito_actual:
        raise ValueError("No se encontró el depósito")
    db.delete(deposito_actual)
    db.commit()
    return True, "Depósito eliminado correctamente"