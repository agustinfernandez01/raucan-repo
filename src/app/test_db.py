"""Prueba de conexión a la DB. Ejecutar desde src: python -m app.test_db  o desde src/app: python test_db.py"""
try:
    from app.db import engine
except ModuleNotFoundError:
    from db import engine

try:
    with engine.connect() as conn:
        print("Conexión exitosa a la base de datos")
except Exception as e:
    print(f"Error al conectar a la base de datos: {e}")

