from sqlalchemy.orm import Session, joinedload , selectinload
from app.models.stock_deposito import StockDeposito
from app.models.productos import Productos
from app.models.deposito import Deposito
from app.schemas.stock_deposito import StockDepositoResponse, StockDepositoCreate, StockDepositoUpdate, StockDepositoPatch, StockDepositoDelete
from fastapi import HTTPException, status
from datetime import datetime

# GET
def listar_stock(db: Session) -> list[StockDepositoResponse]:
    """Lista todos los stocks."""
    lista_stock = db.query(StockDeposito).options(selectinload(StockDeposito.deposito),selectinload(StockDeposito.producto)).all()
    if not lista_stock:
        raise ValueError("No se encontraron stocks.")
    return lista_stock

# GET BY ID
def obtener_deposito_por_id(db: Session, id: int) -> StockDepositoResponse:
    """Obtiene un deposito por su id."""
    deposito = db.query(StockDeposito).options(selectinload(StockDeposito.deposito),selectinload(StockDeposito.producto)).filter(StockDeposito.id == id).first()
    if not deposito:
        raise ValueError("No se encontró el deposito.")
    return deposito

# CREATE
def crear_deposito(db: Session, payload: StockDepositoCreate) -> StockDepositoResponse:
    """Crea un nuevo deposito."""
    #validar que el producto y el deposito existan
    check_producto = db.query(Productos).filter(Productos.id == payload.id_producto).first()
    if not check_producto:
        raise ValueError("No se encontró el producto.")
    check_deposito = db.query(Deposito).filter(Deposito.id == payload.id_deposito).first()
    if not check_deposito:
        raise ValueError("No se encontró el deposito.")

    #crear el deposito
    nuevo_stock = StockDeposito(
        id_producto=payload.id_producto,
        id_deposito=payload.id_deposito,
        nombre=payload.nombre,
        cantidad_producto=payload.cantidad_producto,
        descripcion=payload.descripcion,
    )
    db.add(nuevo_stock)
    db.commit()
    db.refresh(nuevo_stock)
    return nuevo_stock

# UPDATE COMPLETO
def actualizar_deposito(
    db: Session,
    deposito_id: int,
    deposito: StockDepositoUpdate
) -> StockDepositoResponse:

    deposito_existente = obtener_deposito_por_id(db, deposito_id)
    if not deposito_existente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el depósito."
        )

    if deposito.nombre and deposito.nombre != deposito_existente.nombre:
        existe = db.query(StockDeposito).filter(
            StockDeposito.nombre == deposito.nombre,
            StockDeposito.id != deposito_id
        ).first()
        if existe:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El nombre del depósito ya existe."
            )

    data = deposito.model_dump(
        exclude_unset=True,
        exclude={"id", "creado_en", "actualizado_en"}
    )

    for key, value in data.items():
        setattr(deposito_existente, key, value)

    deposito_existente.actualizado_en = datetime.now()

    db.commit()
    db.refresh(deposito_existente)

    return deposito_existente

# PATCH
def actualizar_deposito_parcial(
    db: Session,
    deposito_id: int,
    deposito: StockDepositoPatch
) -> StockDepositoResponse:

    deposito_existente = obtener_deposito_por_id(db, deposito_id)
    if not deposito_existente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el depósito."
        )

    data = deposito.model_dump(exclude_unset=True, exclude={"id", "creado_en", "actualizado_en"})

    if deposito.nombre and deposito.nombre != deposito_existente.nombre:
        existe = db.query(StockDeposito).filter(
            StockDeposito.nombre == deposito.nombre,
            StockDeposito.id != deposito_id
        ).first()
        if existe:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El nombre del depósito ya existe."
            )

    for key, value in data.items():
        setattr(deposito_existente, key, value)

    deposito_existente.actualizado_en = datetime.now(timezone.utc)
    db.commit()
    db.refresh(deposito_existente)
    return deposito_existente

# DELETE
def eliminar_deposito(db: Session, deposito_id: int) -> StockDepositoResponse:
    deposito_existente = obtener_deposito_por_id(db, deposito_id)
    if not deposito_existente:
        raise ValueError("No se encontró el deposito.")
    db.delete(deposito_existente)
    db.commit()
    return deposito_existente

