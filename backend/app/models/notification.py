from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from app.database.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=func.gen_random_uuid()
    )

    title = Column(String(150), nullable=False)

    message = Column(Text, nullable=False)

    type = Column(String(50), nullable=False, default="general")

    related_event_id = Column(
        UUID(as_uuid=True),
        ForeignKey("events.id"),
        nullable=True
    )

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )