from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Boolean, func
from app.db import Base

class Sesion(Base):
    __tablename__ = "sesiones"

    id = Column(Integer, primary_key=True, index=True)

    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True)

    token = Column(String(255), nullable=False, unique=True, index=True)

    creado_en = Column(DateTime, nullable=False, server_default=func.now())

    expiracion_en = Column(DateTime, nullable=False)

    revocado = Column(Boolean, nullable=False, server_default="0")