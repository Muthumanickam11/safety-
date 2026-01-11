from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, db
from typing import List

router = APIRouter(tags=["history"])

from sqlalchemy.orm import joinedload

@router.get("/", response_model=List[schemas.HistoryItem])
async def get_history(skip: int = 0, limit: int = 20, database: Session = Depends(db.get_db)):
    history = database.query(models.BlogPost).options(joinedload(models.BlogPost.analytics)).offset(skip).limit(limit).all()
    return history

@router.get("/{blog_id}")
async def get_blog_detail(blog_id: int, database: Session = Depends(db.get_db)):
    blog = database.query(models.BlogPost).filter(models.BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    social = database.query(models.SocialPost).filter(models.SocialPost.blog_post_id == blog_id).all()
    images = database.query(models.Image).filter(models.Image.blog_post_id == blog_id).all()
    analytics = database.query(models.Analytics).filter(models.Analytics.blog_post_id == blog_id).first()
    
    return {
        "blog": blog,
        "social_posts": social,
        "images": images,
        "analytics": analytics
    }
