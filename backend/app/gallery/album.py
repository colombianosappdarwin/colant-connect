import uuid
from datetime import datetime

from sqlalchemy import Column, Date, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.database.database import Base


class GalleryAlbum(Base):
    __tablename__ = "gallery_albums"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    location = Column(
        String,
        nullable=True
    )

    album_date = Column(
        Date,
        nullable=True
    )

    cover_image_url = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )