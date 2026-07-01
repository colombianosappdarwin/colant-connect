from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    event_date: datetime


class EventResponse(BaseModel):
    id: UUID
    title: str
    description: str
    location: str
    event_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True