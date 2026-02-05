from sqlalchemy import Column, Float, Integer, String

from app.db import Base


class Producto(Base):
    """Producto: comida de animales vendida por kg."""

    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    precio_por_kg = Column(Float, nullable=False)
