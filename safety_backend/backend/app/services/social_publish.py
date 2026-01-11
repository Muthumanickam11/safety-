import asyncio

async def publish_to_twitter(content: str):
    print(f"Publishing to Twitter: {content[:50]}...")
    await asyncio.sleep(1)
    return True

async def publish_to_linkedin(content: str):
    print(f"Publishing to LinkedIn: {content[:50]}...")
    await asyncio.sleep(1)
    return True

async def publish_to_instagram(content: str, image_url: str = None):
    print(f"Publishing to Instagram: {content[:50]}...")
    await asyncio.sleep(1)
    return True
