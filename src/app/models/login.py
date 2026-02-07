from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.db import Base

class Login(Base):
    __tablename__ = "login"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    token = Column(String(255), nullable=False)
    expiracion_en = Column(DateTime, nullable=False)
    creado_en = Column(DateTime, nullable=False)

