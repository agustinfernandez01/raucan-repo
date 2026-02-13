# src/app/test_db.py
from app.db import engine

try:
    with engine.connect() as conn:
        print("Conexión exitosa a la base de datos")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")
