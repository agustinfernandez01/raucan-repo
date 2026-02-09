from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


class Mascota(Base):
    """Mascota asociada a un usuario (dueño)."""

    __tablename__ = "mascotas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre = Column(String(255), nullable=False)
    especie = Column(String(100), nullable=True)  # perro, gato, etc.
    raza = Column(String(255), nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)
    peso_kg = Column(Float, nullable=True)
    notas = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    usuario = relationship("Usuario", back_populates="mascotas")
