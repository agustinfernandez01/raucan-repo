from sqlalchemy import Column, Integer, String
from app.db import Base

class CategoriaProducto(Base):
    __tablename__ = "categoria_producto"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(String(255), nullable=True)

