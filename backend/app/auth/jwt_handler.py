from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "colconnect_super_secret"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire,
        "type": "access"
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def create_password_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(
        minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
    )

    to_encode = {
        "sub": email,
        "exp": expire,
        "type": "password_reset"
    }

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_password_reset_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "password_reset":
            return None

        return payload.get("sub")

    except Exception:
        return None