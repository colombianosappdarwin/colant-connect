import os
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


def upload_image(file, folder="colant/events"):
    result = cloudinary.uploader.upload(
        file.file,
        folder=folder,
        resource_type="image"
    )

    return result.get("secure_url")