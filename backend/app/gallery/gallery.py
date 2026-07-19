import uuid

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from app.database.database import Base


class Gallery(Base):
    __tablename__ = "gallery"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    image_url = Column(
        String,
        nullable=False
    )

    album_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "gallery_albums.id",
            ondelete="CASCADE"
        ),
        nullable=True
    )

    # Se conserva temporalmente para no dañar las fotos antiguas
    # que todavía estén asociadas a eventos.
    event_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "events.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )