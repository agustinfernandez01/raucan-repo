from pydantic import BaseModel, EmailStr  # EmailStr requiere email-validator: pip install email-validator

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: dict[str, str] = {"bearer": "Bearer"}