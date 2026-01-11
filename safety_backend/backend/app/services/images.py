from openai import OpenAI
from ..config import settings
from ..schemas import ImageRequest

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_blog_hero(topic: str, style: str) -> str:
    params = ImageRequest(topic=topic, image_style=style, usage="blog_hero")
    return await generate_image(params)

async def generate_social_images(topic: str, style: str) -> list:
    params = ImageRequest(topic=topic, image_style=style, usage="social")
    url = await generate_image(params)
    return [url] # Returns array as requested

async def generate_image(params: ImageRequest) -> str:
    prompt = f"""
    Create a blog hero image for the topic '{params.topic}' in style '{params.image_style}'.
    Wide aspect, strong focal center, minimal text, futuristic/professional mood.
    """
    
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        return response.data[0].url
    except Exception as e:
        # Placeholder image URL for local testing
        return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"
