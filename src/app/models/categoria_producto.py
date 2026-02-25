from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db import Base


class CategoriaProducto(Base):
    __tablename__ = "categoria_producto"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=True)
    productos = relationship("Productos", back_populates="categoria_producto")
