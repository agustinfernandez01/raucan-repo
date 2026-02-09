from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Carrito(Base):
    """Item del carrito: producto y cantidad en kg por usuario."""

    __tablename__ = "carrito"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad_kg = Column(Float, nullable=False)
    precio_por_kg = Column(Float, nullable=True)  # snapshot al agregar (opcional)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="carrito")
    producto = relationship("Producto", back_populates="carrito")
