from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

from app.models.user_model import User
from app.models.event import Event
from app.models.notification import Notification
from app.gallery.gallery import Gallery
from app.businesses.business_model import Business

from app.auth.routes import router as auth_router
from app.events.routes import router as events_router
from app.gallery.routes import router as gallery_router
from app.businesses.routes import router as businesses_router
from app.notifications.routes import router as notifications_router
from app.admin.admin_router import router as admin_router

app = FastAPI(
    title="COLANT Connect API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Authentication
app.include_router(auth_router, prefix="/auth")

# Events
app.include_router(events_router)

# Gallery
app.include_router(gallery_router, prefix="/gallery")

# Businesses
app.include_router(businesses_router, prefix="/businesses")

# Notifications
app.include_router(notifications_router)

# Admin
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "message": "COLANT Connect API Running",
        "version": "1.0.0"
    }