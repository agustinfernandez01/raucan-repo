"""
Conexión a la base de datos.
Usar DATABASE_URL en .env (ej: postgresql+asyncpg://user:pass@host/db o sqlite:///./local.db).
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./local.db",  # por defecto SQLite para desarrollo (MySQL vía .env en prod)
)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependencia para inyectar sesión en las rutas."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
