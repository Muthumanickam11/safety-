from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, db
from ..tasks.jobs import publish_social_post
from datetime import datetime

router = APIRouter(tags=["schedule"])

@router.post("/")
async def schedule_publishing(request: schemas.ScheduleRequest, database: Session = Depends(db.get_db)):
    db_schedule = models.Schedule(
        item_type=request.item_type,
        item_id=request.item_id,
        platform_targets=request.platform_targets,
        publish_at=request.publish_at,
        status=models.ScheduleStatusEnum.pending
    )
    database.add(db_schedule)
    database.commit()
    database.refresh(db_schedule)
    
    # Enqueue task to run at publish_at
    # calculate delay
    now = datetime.utcnow()
    delay = (request.publish_at - now).total_seconds()
    
    if delay < 0:
        delay = 0
        
    publish_social_post.apply_async(args=[db_schedule.id], countdown=delay)
    
    return {"status": "scheduled", "schedule_id": db_schedule.id}

@router.get("/")
async def list_schedules(database: Session = Depends(db.get_db)):
    return database.query(models.Schedule).all()
