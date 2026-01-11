import cloudinary
import cloudinary.uploader
from ..config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

async def upload_image_s3(image_bytes: bytes, file_name: str) -> str:
    try:
        if not settings.AWS_ACCESS_KEY_ID:
            return "s3-mock-url"
        
        # Import boto3 here to keep it optional if not used
        import boto3
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        s3.put_object(Bucket=settings.S3_BUCKET_NAME, Key=file_name, Body=image_bytes)
        return f"https://{settings.S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}"
    except Exception as e:
        print(f"S3 Upload error: {e}")
        return ""

async def upload_image(image_bytes_or_url: str) -> str:
    try:
        if not settings.CLOUDINARY_CLOUD_NAME:
            return image_bytes_or_url # Return original if not configured
            
        result = cloudinary.uploader.upload(image_bytes_or_url)
        return result.get("secure_url")
    except Exception as e:
        print(f"Upload error: {e}")
        return image_bytes_or_url
