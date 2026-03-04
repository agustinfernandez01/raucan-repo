from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class StockDeposito(Base):
    __tablename__ = "stock_deposito"
    id = Column(Integer, primary_key=True, index=True)
    id_producto = Column(Integer, ForeignKey("productos.id"), nullable=False)
    id_deposito = Column(Integer, ForeignKey("deposito.id"), nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(String(255), nullable=True)
    cantidad_producto = Column(Float, nullable=False, default=0) 
    actualizado_en = Column(DateTime, nullable=False, default=func.now())
    #relaciones
    producto = relationship("Productos")
    deposito = relationship("Deposito")


