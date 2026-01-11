from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .models import PlatformEnum, ItemTypeEnum, ScheduleStatusEnum

class BlogRequest(BaseModel):
    topic: str
    audience: Optional[str] = "General"
    tone: Optional[str] = "Professional"
    length: Optional[str] = "1000 words"
    language: Optional[str] = "English"

class BlogResponse(BaseModel):
    title: str
    slug: str
    content_markdown: str
    keywords: List[str]
    meta_title: str
    meta_description: str
    outline: List[str]
    tone: Optional[str] = "professional"
    word_count: int


class SocialRequest(BaseModel):
    topic: str
    source_content: str
    platforms: List[PlatformEnum]

class SocialResponse(BaseModel):
    twitter: Optional[List[str]] = []
    linkedin: Optional[List[str]] = []
    instagram: Optional[List[str]] = []
    hashtag_candidates: List[str]

class ImageRequest(BaseModel):
    topic: str
    image_style: str
    usage: str # blog_hero, social

class ImageResponse(BaseModel):
    image_url: Optional[str] = None
    blog_hero_url: Optional[str] = None
    social_image_urls: Optional[List[str]] = []

class SaveBlogRequest(BaseModel):
    user_id: int
    topic: str
    blog: BlogResponse
    social: Optional[SocialResponse] = None
    images: Optional[List[ImageResponse]] = None

class ScheduleRequest(BaseModel):
    item_type: ItemTypeEnum
    item_id: int
    platform_targets: List[PlatformEnum]
    publish_at: datetime

class AnalyticsResponse(BaseModel):
    word_count: Optional[int] = 0
    reading_time_minutes: Optional[int] = 0
    seo_score: Optional[int] = 0

    class Config:
        from_attributes = True

class HistoryItem(BaseModel):
    id: int
    topic: str
    title: str
    content_markdown: str
    tone: Optional[str] = "professional"
    created_at: datetime
    analytics: Optional[AnalyticsResponse] = None

    class Config:
        from_attributes = True
