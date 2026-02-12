from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Comentarios(Base):
    __tablename__ = "comentarios"
    id = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    contenido = Column(String(255), nullable=False)
    creado_en = Column(DateTime, nullable=False, default=func.now())
    actualizado_en = Column(DateTime, nullable=True)
    #relaciones
    usuario = relationship("Usuario")
