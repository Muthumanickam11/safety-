# AI-Powered Content Generator Backend

This is the backend for an AI-powered content generator built with FastAPI, SQLAlchemy, PostgreSQL, and Celery.

## Features
- **SEO Blog Generation**: Generates titles, slugs, markdown content, keywords, and meta-descriptions.
- **Social Media Generation**: Creates platform-specific posts for Twitter, LinkedIn, and Instagram.
- **Image Generation**: Generates hero and social media images using DALL-E.
- **Content Management**: Save and retrieve history of generated content.
- **Scheduling**: Schedule social media posts to be published at a later time.
- **Analytics**: Basic SEO scoring and reading time calculations.

## Project Structure
- `app/main.py`: Entry point.
- `app/routers/`: API endpoints.
- `app/services/`: Business logic (LLM, Image, SEO, Storage).
- `app/tasks/`: Celery background jobs.
- `app/models.py`: Database schema.
- `app/schemas.py`: Pydantic validation.

## Setup
1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set up environment variables in `.env`.
4. Run the API: `uvicorn app.main:app --reload`.
5. Run Celery worker: `celery -A app.tasks.celery_app worker --loglevel=info`.

## Environment Variables
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `REDIS_URL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
