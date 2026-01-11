from .celery_app import celery_app
from ..services import social_publish
from ..models import Schedule, ScheduleStatusEnum
from ..db import SessionLocal
import asyncio

@celery_app.task(name="publish_social_post")
def publish_social_post(schedule_id: int):
    db = SessionLocal()
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    
    if not schedule:
        return "Schedule not found"
        
    try:
        # In a real app, you'd fetch the content of the post here
        # For demo, we just call the publish service
        for platform in schedule.platform_targets:
            if platform == "twitter":
                asyncio.run(social_publish.publish_to_twitter("Mock post content"))
            elif platform == "linkedin":
                asyncio.run(social_publish.publish_to_linkedin("Mock post content"))
            elif platform == "instagram":
                asyncio.run(social_publish.publish_to_instagram("Mock post content"))
                
        schedule.status = ScheduleStatusEnum.sent
        db.commit()
        return f"Successfully published schedule {schedule_id}"
    except Exception as e:
        schedule.status = ScheduleStatusEnum.failed
        db.commit()
        return f"Failed to publish schedule {schedule_id}: {str(e)}"
    finally:
        db.close()
