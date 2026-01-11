from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .db import Base

class PlatformEnum(str, enum.Enum):
    twitter = "twitter"
    linkedin = "linkedin"
    instagram = "instagram"

class ItemTypeEnum(str, enum.Enum):
    blog = "blog"
    social = "social"

class ScheduleStatusEnum(str, enum.Enum):
    pending = "pending"
    sent = "sent"
    failed = "failed"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    blog_posts = relationship("BlogPost", back_populates="owner")

class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    title = Column(String)
    slug = Column(String, unique=True, index=True)
    content_markdown = Column(Text)
    keywords = Column(JSON)
    meta_title = Column(String)
    meta_description = Column(String)
    outline = Column(JSON)
    tone = Column(String)
    word_count = Column(Integer)

    created_at = Column(DateTime, server_default=func.now())

    owner = relationship("User", back_populates="blog_posts")
    social_posts = relationship("SocialPost", back_populates="blog_post")
    images = relationship("Image", back_populates="blog_post")
    analytics = relationship("Analytics", back_populates="blog_post", uselist=False)

class SocialPost(Base):
    __tablename__ = "social_posts"
    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id"))
    platform = Column(SQLEnum(PlatformEnum))
    content = Column(Text)
    hashtags = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())

    blog_post = relationship("BlogPost", back_populates="social_posts")
    images = relationship("Image", back_populates="social_post")

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id"), nullable=True)
    social_post_id = Column(Integer, ForeignKey("social_posts.id"), nullable=True)
    url = Column(String)
    style = Column(String)
    prompt = Column(Text)
    usage = Column(String) # blog_hero, social
    created_at = Column(DateTime, server_default=func.now())

    blog_post = relationship("BlogPost", back_populates="images")
    social_post = relationship("SocialPost", back_populates="images")

class Schedule(Base):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True, index=True)
    item_type = Column(SQLEnum(ItemTypeEnum))
    item_id = Column(Integer)
    platform_targets = Column(JSON)
    publish_at = Column(DateTime)
    status = Column(SQLEnum(ScheduleStatusEnum), default=ScheduleStatusEnum.pending)
    created_at = Column(DateTime, server_default=func.now())

class Analytics(Base) :
    __tablename__ = "analytics"
    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id"))
    word_count = Column(Integer)
    reading_time_minutes = Column(Integer)
    seo_score = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())

    blog_post = relationship("BlogPost", back_populates="analytics")
