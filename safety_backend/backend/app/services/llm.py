import json
from openai import OpenAI
from ..config import settings
from ..schemas import BlogRequest, BlogResponse, SocialResponse

client = OpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_blog(params: BlogRequest) -> BlogResponse:
    prompt = f"""
    You are an expert SEO content writer. Write an SEO-optimized blog for the topic: '{params.topic}'.
    Audience: {params.audience}, Tone: {params.tone}, Language: {params.language}, Length: {params.length}.
    Return JSON with title, slug, content_markdown, keywords[], meta_title, meta_description, outline[], word_count.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert SEO content writer who produces well-structured, accurate, and engaging articles. Always return valid JSON following the schema."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        return BlogResponse(**data)
    except Exception as e:
        # Fallback/Mock for demo if API fails
        return BlogResponse(
            title=f"Expert Guide to {params.topic}",
            slug=f"guide-to-{params.topic.replace(' ', '-').lower()}",
            content_markdown=f"# {params.topic}\n\nThis is a sample generated blog content following the requested format.",
            keywords=[params.topic, "SEO", "Innovation"],
            meta_title=f"The Ultimate Guide to {params.topic}",
            meta_description=f"Discover insights and strategies about {params.topic}.",
            outline=["Introduction", "Trend Analysis", "Strategy", "Conclusion"],
            word_count=500
        )

async def generate_social(topic: str, content_markdown: str) -> SocialResponse:
    prompt = f"""
    You are a social media copywriter. Based on the blog below, generate posts:
    - Twitter: ≤280 chars, 1–3 hashtags.
    - LinkedIn: professional tone.
    - Instagram: casual tone, emojis + hashtags.
    Return JSON with twitter[], linkedin[], instagram[], hashtag_candidates[].
    
    Blog content:
    {content_markdown}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a social media copywriter. Return a strict JSON object with arrays per platform. Adhere to constraints."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content)
        return SocialResponse(**data)
    except Exception as e:
        return SocialResponse(
            twitter=[f"Excited to share our latest blog on {topic}!"],
            linkedin=[f"In our latest article, we dive deep into {topic}. Check it out!"],
            instagram=[f"New blog alert! 🚀 Topic: {topic} #blog #ai"],
            hashtag_candidates=["#AI", "#ContentMarketing"]
        )
