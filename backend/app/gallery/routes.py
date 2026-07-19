from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.gallery.album import GalleryAlbum
from app.gallery.gallery import Gallery


router = APIRouter(
    prefix="",
    tags=["Gallery"]
)


# =========================================================
# SCHEMAS
# =========================================================

class AlbumCreate(BaseModel):
    title: str
    description: str = ""
    cover_image_url: str = ""


class AlbumUpdate(BaseModel):
    title: str
    description: str = ""
    cover_image_url: str = ""


class PhotoCreate(BaseModel):
    image_url: str


# =========================================================
# ÁLBUMES
# =========================================================

@router.post("/albums")
def create_album(
    album_data: AlbumCreate,
    db: Session = Depends(get_db)
):
    title = album_data.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="El título del álbum es obligatorio."
        )

    album = GalleryAlbum(
        title=title,
        description=album_data.description.strip(),
        cover_image_url=album_data.cover_image_url.strip()
    )

    db.add(album)
    db.commit()
    db.refresh(album)

    return album


@router.get("/albums")
def get_albums(
    db: Session = Depends(get_db)
):
    albums = (
        db.query(GalleryAlbum)
        .order_by(GalleryAlbum.created_at.desc())
        .all()
    )

    result = []

    for album in albums:
        photo_count = (
            db.query(Gallery)
            .filter(Gallery.album_id == album.id)
            .count()
        )

        cover_image_url = album.cover_image_url or ""

        if not cover_image_url:
            first_photo = (
                db.query(Gallery)
                .filter(Gallery.album_id == album.id)
                .first()
            )

            if first_photo:
                cover_image_url = first_photo.image_url

        result.append({
            "id": str(album.id),
            "title": album.title,
            "description": album.description or "",
            "cover_image_url": cover_image_url,
            "created_at": album.created_at,
            "photo_count": photo_count
        })

    return result


@router.get("/albums/{album_id}")
def get_album(
    album_id: str,
    db: Session = Depends(get_db)
):
    album_uuid = validate_uuid(
        album_id,
        "ID de álbum inválido."
    )

    album = (
        db.query(GalleryAlbum)
        .filter(GalleryAlbum.id == album_uuid)
        .first()
    )

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado."
        )

    photo_count = (
        db.query(Gallery)
        .filter(Gallery.album_id == album.id)
        .count()
    )

    return {
        "id": str(album.id),
        "title": album.title,
        "description": album.description or "",
        "cover_image_url": album.cover_image_url or "",
        "created_at": album.created_at,
        "photo_count": photo_count
    }


@router.put("/albums/{album_id}")
def update_album(
    album_id: str,
    album_data: AlbumUpdate,
    db: Session = Depends(get_db)
):
    album_uuid = validate_uuid(
        album_id,
        "ID de álbum inválido."
    )

    album = (
        db.query(GalleryAlbum)
        .filter(GalleryAlbum.id == album_uuid)
        .first()
    )

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado."
        )

    title = album_data.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="El título del álbum es obligatorio."
        )

    album.title = title
    album.description = album_data.description.strip()
    album.cover_image_url = album_data.cover_image_url.strip()

    db.commit()
    db.refresh(album)

    return album


@router.delete("/albums/{album_id}")
def delete_album(
    album_id: str,
    db: Session = Depends(get_db)
):
    album_uuid = validate_uuid(
        album_id,
        "ID de álbum inválido."
    )

    album = (
        db.query(GalleryAlbum)
        .filter(GalleryAlbum.id == album_uuid)
        .first()
    )

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado."
        )

    db.delete(album)
    db.commit()

    return {
        "message": "Álbum eliminado correctamente."
    }


# =========================================================
# FOTOGRAFÍAS
# =========================================================

@router.post("/albums/{album_id}/photos")
def add_photo_to_album(
    album_id: str,
    photo_data: PhotoCreate,
    db: Session = Depends(get_db)
):
    album_uuid = validate_uuid(
        album_id,
        "ID de álbum inválido."
    )

    album = (
        db.query(GalleryAlbum)
        .filter(GalleryAlbum.id == album_uuid)
        .first()
    )

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado."
        )

    image_url = photo_data.image_url.strip()

    if not image_url:
        raise HTTPException(
            status_code=400,
            detail="La URL de la imagen es obligatoria."
        )

    photo = Gallery(
        image_url=image_url,
        album_id=album_uuid,
        event_id=None
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    if not album.cover_image_url:
        album.cover_image_url = image_url
        db.commit()
        db.refresh(album)

    return photo


@router.get("/albums/{album_id}/photos")
def get_album_photos(
    album_id: str,
    db: Session = Depends(get_db)
):
    album_uuid = validate_uuid(
        album_id,
        "ID de álbum inválido."
    )

    album = (
        db.query(GalleryAlbum)
        .filter(GalleryAlbum.id == album_uuid)
        .first()
    )

    if not album:
        raise HTTPException(
            status_code=404,
            detail="Álbum no encontrado."
        )

    photos = (
        db.query(Gallery)
        .filter(Gallery.album_id == album_uuid)
        .all()
    )

    return photos


@router.delete("/photos/{photo_id}")
def delete_photo(
    photo_id: str,
    db: Session = Depends(get_db)
):
    photo_uuid = validate_uuid(
        photo_id,
        "ID de fotografía inválido."
    )

    photo = (
        db.query(Gallery)
        .filter(Gallery.id == photo_uuid)
        .first()
    )

    if not photo:
        raise HTTPException(
            status_code=404,
            detail="Fotografía no encontrada."
        )

    album_id = photo.album_id
    deleted_image_url = photo.image_url

    db.delete(photo)
    db.commit()

    if album_id:
        album = (
            db.query(GalleryAlbum)
            .filter(GalleryAlbum.id == album_id)
            .first()
        )

        if album and album.cover_image_url == deleted_image_url:
            first_photo = (
                db.query(Gallery)
                .filter(Gallery.album_id == album_id)
                .first()
            )

            album.cover_image_url = (
                first_photo.image_url
                if first_photo
                else ""
            )

            db.commit()

    return {
        "message": "Fotografía eliminada correctamente."
    }


# =========================================================
# FUNCIONES AUXILIARES
# =========================================================

def validate_uuid(
    value: str,
    error_message: str
) -> UUID:
    try:
        return UUID(value)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=400,
            detail=error_message
        )