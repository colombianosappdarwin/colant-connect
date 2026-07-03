from sqlalchemy import (
    Column,
    String,
    DateTime,
    Date,
    Boolean
)

from sqlalchemy.dialects.postgresql import UUID

from app.database.database import Base

import uuid
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # =============================
    # BASIC INFORMATION
    # =============================

    full_name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    phone = Column(String)

    gender = Column(String)

    birth_date = Column(Date)

    # =============================
    # COMMUNITY INFORMATION
    # =============================

    country_origin = Column(String)

    city_origin = Column(String)

    industry = Column(String)

    visa_type = Column(String)

    arrival_date = Column(Date)

    preferred_language = Column(
        String,
        default="es"
    )

    profile_photo_url = Column(String)

    # =============================
    # SECURITY
    # =============================

    role = Column(
        String,
        default="user"
    )

    is_active = Column(
        Boolean,
        default=True
    )

    email_verified = Column(
        Boolean,
        default=False
    )

    verification_code = Column(String)

    verification_code_expires = Column(DateTime)

    two_factor_enabled = Column(
        Boolean,
        default=False
    )

    # =============================
    # AUDIT
    # =============================

    last_login = Column(DateTime)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )