<<<<<<< HEAD
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
=======
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
from app.db import Base


class CategoriaProducto(Base):
<<<<<<< HEAD
    __tablename__ = "categoria_producto"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(String(255), nullable=True)
    productos = relationship("Productos", back_populates="categoria_producto")

=======
    """Categoría de productos (perros, gatos, etc.)."""

    __tablename__ = "categoria_producto"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    actualizado_en = Column(DateTime(timezone=True), onupdate=func.now())

    productos = relationship("Producto", back_populates="categoria_rel")
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
