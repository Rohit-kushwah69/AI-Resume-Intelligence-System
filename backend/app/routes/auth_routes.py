from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..database.models import Admin

from ..schemas.auth_schema import (
    AdminRegister,
    AdminLogin,
    TokenResponse
)

from ..utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_admin
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# =========================
# REGISTER ADMIN
# =========================

@router.post("/register")
def register_admin(
    admin_data: AdminRegister,
    db: Session = Depends(get_db)
):

    # Check existing admin
    existing_admin = db.query(Admin).filter(
        Admin.email == admin_data.email
    ).first()

    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Admin with this email already exists"
        )

    # Hash password
    hashed_password = hash_password(
        admin_data.password
    )

    # Create admin
    new_admin = Admin(
        name=admin_data.name,
        email=admin_data.email,
        password=hashed_password
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {
        "message": "Admin registered successfully",
        "admin_id": new_admin.id,
        "name": new_admin.name,
        "email": new_admin.email
    }


# =========================
# LOGIN ADMIN
# =========================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login_admin(
    login_data: AdminLogin,
    db: Session = Depends(get_db)
):

    # Find admin
    admin = db.query(Admin).filter(
        Admin.email == login_data.email
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = verify_password(
        login_data.password,
        admin.password
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT
    access_token = create_access_token({
        "sub": str(admin.id),
        "email": admin.email,
        "name": admin.name
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# =========================
# CURRENT ADMIN
# =========================

@router.get("/me")
def get_me(
    current_admin: dict = Depends(get_current_admin)
):

    return {
        "message": "Authentication successful",
        "admin": current_admin
    }