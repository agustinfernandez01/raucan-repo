from sqlalchemy.orm import Session, joinedload , selectinload
from app.models.stock_deposito import StockDeposito
from app.models.productos import Producto
from app.models.deposito import Deposito
from app.schemas.stock_deposito import StockDepositoResponse, StockDepositoCreate, StockDepositoUpdate, StockDepositoPatch, StockDepositoDelete

# GET
def listar_depositos(db: Session) -> list[StockDepositoResponse]:
    """Lista todos los depositos."""
    lista_depositos = db.query(StockDeposito).options(selectinload(StockDeposito.deposito),selectinload(StockDeposito.producto)).all()
    if not lista_depositos:
        raise ValueError("No se encontraron depositos.")
    return lista_depositos

# GET BY ID
def obtener_deposito_por_id(db: Session, id: int) -> StockDepositoResponse:
    """Obtiene un deposito por su id."""
    deposito = db.query(StockDeposito).options(selectinload(StockDeposito.deposito),selectinload(StockDeposito.producto)).filter(StockDeposito.id == id).first()
    if not deposito:
        raise ValueError("No se encontró el deposito.")
    return deposito

# CREATE
def crear_deposito(db: Session, deposito: StockDepositoCreate) -> StockDepositoResponse:
    """Crea un nuevo deposito."""
    #validar que el producto y el deposito existan
    producto = db.query(Producto).filter(Producto.id == deposito.id_producto).first()
    if not producto:
        raise ValueError("No se encontró el producto.")
    deposito = db.query(Deposito).filter(Deposito.id == deposito.id_deposito).first()
    if not deposito:
        raise ValueError("No se encontró el deposito.")

    #crear el deposito
    nuevo_deposito = StockDeposito(
        id_producto=deposito.id_producto,
        id_deposito=deposito.id_deposito,
        nombre=deposito.nombre,
        cantidad_producto=deposito.cantidad_producto,
        descripcion=deposito.descripcion,
    )
    db.add(nuevo_deposito)
    db.commit()
    db.refresh(nuevo_deposito)
    return nuevo_deposito

# UPDATE COMPLETO
def actualizar_deposito(
    db: Session,
    deposito_id: int,
    deposito: StockDepositoUpdate
) -> StockDepositoResponse:

    deposito_existente = obtener_deposito_por_id(db, deposito_id)
    if not deposito_existente:
        raise ValueError("No se encontró el deposito.")

    # Validar nombre único solo si cambia
    if deposito.nombre != deposito_existente.nombre:
        existe = db.query(StockDeposito).filter(
            StockDeposito.nombre == deposito.nombre,
            StockDeposito.id != deposito_id
        ).first()
        if existe:
            raise ValueError("El nombre del deposito ya existe.")

    # Update completo (evitá pisar id/fechas si existen)
    data = deposito.model_dump(exclude={"id", "creado_en", "actualizado_en"})
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
        raise ValueError("No se encontró el deposito.")

    data = deposito.model_dump(exclude_unset=True, exclude={"id", "creado_en", "actualizado_en"})

    # Validar nombre único solo si viene y cambia
    if "nombre" in data and data["nombre"] != deposito_existente.nombre:
        existe = db.query(StockDeposito).filter(
            StockDeposito.nombre == data["nombre"],
            StockDeposito.id != deposito_id
        ).first()
        if existe:
            raise ValueError("El nombre del deposito ya existe.")

    for key, value in data.items():
        setattr(deposito_existente, key, value)

    deposito_existente.actualizado_en = datetime.now()
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

