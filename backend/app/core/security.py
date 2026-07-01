from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.database.database import SessionLocal
from app.models.user_model import User

SECRET_KEY = "colconnect_super_secret"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")
        token_type = payload.get("type")

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        if token_type and token_type != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid token type"
            )

        return email

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token invalid or expired"
        )


def get_current_user(email: str = Depends(verify_token)):
    db = SessionLocal()

    user = db.query(User).filter(User.email == email).first()

    db.close()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is blocked"
        )

    return user