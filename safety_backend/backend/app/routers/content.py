from fastapi import APIRouter, Depends, HTTPException
from ..schemas import BlogRequest, BlogResponse, SocialResponse, SocialRequest, ImageRequest, ImageResponse
from ..services import llm, images, seo
from typing import List

router = APIRouter(tags=["content"])

@router.post("/generate-blog", response_model=BlogResponse)
async def generate_blog(request: BlogRequest):
    return await llm.generate_blog(request)

@router.post("/generate-social", response_model=SocialResponse)
async def generate_social(request: SocialRequest):
    return await llm.generate_social(request.topic, request.source_content)

@router.post("/generate-image", response_model=ImageResponse)
async def generate_image(request: ImageRequest):
    url = await images.generate_image(request)
    if request.usage == "blog_hero":
        return ImageResponse(blog_hero_url=url, image_url=url)
    else:
        return ImageResponse(social_image_urls=[url], image_url=url)
