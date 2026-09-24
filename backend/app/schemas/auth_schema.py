from pydantic import BaseModel, EmailStr


# =========================
# REGISTER SCHEMA
# =========================

class AdminRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


# =========================
# LOGIN SCHEMA
# =========================

class AdminLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# AUTH RESPONSE
# =========================

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"