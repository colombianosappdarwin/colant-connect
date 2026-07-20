from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    Integer
)
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

    # =====================================================
    # CONTENT
    # =====================================================

    title = Column(
        String(150),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    image_url = Column(
        Text,
        nullable=True
    )

    # general, event, community, emergency, promotion
    category = Column(
        String(50),
        nullable=False,
        default="general"
    )

    # low, normal, high, urgent
    priority = Column(
        String(30),
        nullable=False,
        default="normal"
    )

    # Se conserva para no afectar el código anterior
    type = Column(
        String(50),
        nullable=False,
        default="general"
    )

    related_event_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "events.id",
            ondelete="SET NULL"
        ),
        nullable=True
    )

    # =====================================================
    # DELIVERY CHANNELS
    # =====================================================

    send_in_app = Column(
        Boolean,
        nullable=False,
        default=True
    )

    send_push = Column(
        Boolean,
        nullable=False,
        default=True
    )

    send_email = Column(
        Boolean,
        nullable=False,
        default=True
    )

    # =====================================================
    # STATUS
    # =====================================================

    # draft, published, sent, partially_sent, failed
    status = Column(
        String(30),
        nullable=False,
        default="draft"
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True
    )

    # =====================================================
    # DELIVERY RESULTS
    # =====================================================

    total_users = Column(
        Integer,
        nullable=False,
        default=0
    )

    push_sent = Column(
        Integer,
        nullable=False,
        default=0
    )

    push_failed = Column(
        Integer,
        nullable=False,
        default=0
    )

    email_sent = Column(
        Integer,
        nullable=False,
        default=0
    )

    email_failed = Column(
        Integer,
        nullable=False,
        default=0
    )

    # =====================================================
    # DATES
    # =====================================================

    sent_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    reminder_sent_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )