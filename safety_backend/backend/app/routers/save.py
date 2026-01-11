from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, db
from ..services import seo
from typing import List

router = APIRouter(tags=["save"])

@router.post("/save-blog")
async def save_blog(request: schemas.SaveBlogRequest, database: Session = Depends(db.get_db)):
    # 1. Save Blog Post
    db_blog = models.BlogPost(
        user_id=request.user_id,
        topic=request.topic,
        title=request.blog.title,
        slug=request.blog.slug,
        content_markdown=request.blog.content_markdown,
        keywords=request.blog.keywords,
        meta_title=request.blog.meta_title,
        meta_description=request.blog.meta_description,
        outline=request.blog.outline,
        tone=request.blog.tone,
        word_count=request.blog.word_count
    )


    database.add(db_blog)
    database.flush() # Get ID
    
    # 2. Save Social Posts
    if request.social:
        for platform in ["twitter", "linkedin", "instagram"]:
            posts = getattr(request.social, platform)
            for post_content in posts:
                db_social = models.SocialPost(
                    blog_post_id=db_blog.id,
                    platform=platform,
                    content=post_content,
                    hashtags=request.social.hashtag_candidates
                )
                database.add(db_social)
    
    # 3. Save Images
    if request.images:
        for img in request.images:
            db_img = models.Image(
                blog_post_id=db_blog.id,
                url=img.image_url,
                usage="blog_hero" # Default
            )
            database.add(db_img)
            
    # 4. Save Analytics
    seo_score = seo.compute_seo_score(request.blog.content_markdown, request.blog.keywords)
    reading_time = seo.compute_reading_time(request.blog.content_markdown)
    
    db_analytics = models.Analytics(
        blog_post_id=db_blog.id,
        word_count=request.blog.word_count,
        reading_time_minutes=reading_time,
        seo_score=seo_score
    )
    database.add(db_analytics)
    
    database.commit()
    return {"status": "success", "blog_id": db_blog.id}

@router.get("/export/{blog_id}")
async def export_blog(blog_id: int, format: str = "json", database: Session = Depends(db.get_db)):
    blog = database.query(models.BlogPost).filter(models.BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
        
    data = {
        "title": blog.title,
        "topic": blog.topic,
        "content": blog.content_markdown,
        "keywords": blog.keywords,
        "meta": {
            "title": blog.meta_title,
            "description": blog.meta_description
        }
    }
    
    if format == "csv":
        import csv
        from io import StringIO
        from fastapi.responses import StreamingResponse
        
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(["Field", "Value"])
        for key, value in data.items():
            writer.writerow([key, value])
            
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=blog_{blog_id}.csv"}
        )
        
    return data
