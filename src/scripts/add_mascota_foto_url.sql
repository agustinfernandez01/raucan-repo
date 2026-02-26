-- Agregar columna foto_url a mascotas (para guardar la URL de la foto).
-- Ejecutá este script una sola vez en tu base de datos.
-- MySQL:
ALTER TABLE mascotas ADD COLUMN foto_url VARCHAR(500) NULL;

-- Si usás SQLite en cambio:
-- ALTER TABLE mascotas ADD COLUMN foto_url VARCHAR(500);
