from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship

from app.db import Base


class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    # datos personales
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)

    # datos de contacto
    email = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    telefono = Column(String(255), nullable=False)

    # datos de seguridad
    rol = Column(String(255), nullable=False)
    activo = Column(Boolean, default=True)

    creado_en = Column(DateTime, nullable=False)

    mascotas = relationship("Mascota", back_populates="usuario")
    # relaciones
    carrito = relationship("Carrito", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")

