from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Deposito(Base):
    """Stock en depósito por producto (inventario)."""

    __tablename__ = "deposito"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad_kg = Column(Float, nullable=False)
    ubicacion = Column(String(255), nullable=True)
    actualizado_en = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    producto = relationship("Producto", back_populates="depositos")
