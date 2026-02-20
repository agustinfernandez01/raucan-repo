"""
Conexión a la base de datos.
Todas las credenciales se leen del archivo .env (en la raíz de src/).

Opciones en .env:
  - DATABASE_URL: URL completa (ej: mysql+pymysql://user:pass@host:3306/dbname)
  - O por separado: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
"""

import os
from pathlib import Path
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Cargar .env desde src/ (un nivel arriba de app/)
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)

# Usar DATABASE_URL si existe; si no, armar la URL desde variables sueltas
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    user = os.getenv("DB_USER", "")
    password = os.getenv("DB_PASSWORD", "")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "raucandb")
    if user and password and name:
        # Codificar password por si tiene caracteres especiales
        password_encoded = quote_plus(password)
        DATABASE_URL = f"mysql+pymysql://{user}:{password_encoded}@{host}:{port}/{name}"
    else:
        DATABASE_URL = "sqlite:///./local.db"

_connect_args = (
    {"check_same_thread": False}
    if "sqlite" in DATABASE_URL
    else {"connect_timeout": 10}
)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True,
    connect_args=_connect_args,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
