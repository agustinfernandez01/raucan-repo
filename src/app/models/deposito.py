from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String , Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Deposito(Base):
    """Depósito de productos."""
    __tablename__ = "deposito"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(String(255), nullable=False)
    direccion = Column(String(255), nullable=False)
    ubicacion = Column(String(255), nullable=False)
    estado = Column(Boolean, default=True)
    actualizado_en = Column(DateTime, nullable=False)
    



