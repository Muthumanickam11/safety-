from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import content, save, history, schedule
from .db import engine, Base, SessionLocal
from .config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    from .models import User
    if not db.query(User).filter(User.id == 1).first():
        default_user = User(id=1, email="admin@example.com", name="Default Admin")
        db.add(default_user)
        db.commit()
    db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers with prefixes
app.include_router(content.router, prefix="/api/content")
app.include_router(save.router, prefix="/api/save")
app.include_router(history.router, prefix="/api/history")
app.include_router(schedule.router, prefix="/api/schedule")

@app.get("/")
async def root():
    return {"message": "AI Content Generator API is running"}
