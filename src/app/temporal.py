import bcrypt

hash_db = b"$2b$12$QhfMvlcS37uluu8ksb5nYOuledMKoq4zCPK9JRzpN3sHzQARnk7tG"  # pegá el hash completo acá
print(bcrypt.checkpw(b"pelado02", hash_db))

