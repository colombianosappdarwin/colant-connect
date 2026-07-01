from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4

from app.database.database import Base


class Event(Base):

    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    title = Column(String, nullable=False)

    description = Column(String)

    location = Column(String)

    event_date = Column(DateTime)

    created_at = Column(DateTime)