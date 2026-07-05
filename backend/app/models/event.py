from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.database.database import Base
from datetime import datetime
import uuid


class Event(Base):
    __tablename__ = "events"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    title = Column(String, nullable=False)

    description = Column(String, nullable=False)

    location = Column(String, nullable=False)

    image_url = Column(String, default="")

    google_maps_url = Column(String, default="")

    category = Column(String, default="Community")

    event_date = Column(DateTime, nullable=False)

    event_end_date = Column(DateTime)

    capacity = Column(Integer, default=0)

    price = Column(String, default="Free")

    status = Column(String, default="Published")

    featured = Column(Boolean, default=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )