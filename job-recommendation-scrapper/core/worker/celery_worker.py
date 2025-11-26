import logging
import uuid
from datetime import datetime
from typing import Any, Dict

from celery import Celery
from celery.result import AsyncResult

from core.config import settings
from core.enums.scraper_enums import ScraperStatus
from core.models import ScrapeRequest
from core.scrapers import ScraperFactory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Celery
celery_app = Celery(
    'job_scraper',
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    task_time_limit=settings.TASK_TIME_LIMIT,
    task_soft_time_limit=settings.TASK_SOFT_TIME_LIMIT,
)

@celery_app.task(bind=True, max_retries=3)
def scrape_url_task(self, job_id: str, request_data: Dict[str, Any]):
    """Celery task to scrape a URL"""
    scrape_request = None
    try:
        logger.info(f"Starting scrape job {job_id}")
        
        # Parse request data
        scrape_request = ScrapeRequest(**request_data)
        
        # Create scraper
        scraper = ScraperFactory.create_scraper(
            scraper_type=scrape_request.scraper_type,
            url=str(scrape_request.url),
            headers=scrape_request.headers,
            cookies=scrape_request.cookies,
            proxy=scrape_request.proxy,
            wait_time=scrape_request.wait_time
        )
        
        # Perform scraping
        result = scraper.scrape(selectors=scrape_request.selectors)
        
        # Cleanup
        scraper.cleanup()
        
        logger.info(f"Completed scrape job {job_id}")
        
        return {
            "job_id": job_id,
            "status": ScraperStatus.COMPLETED,
            "result": result,
            "completed_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error in scrape job {job_id}: {str(e)}")

        if scrape_request and self.request.retries < scrape_request.max_retries:
            raise self.retry(exc=e, countdown=2 ** self.request.retries)
        
        return {
            "job_id": job_id,
            "status": ScraperStatus.FAILED,
            "error": str(e),
            "completed_at": datetime.utcnow().isoformat()
        }

@celery_app.task
def scrape_bulk_urls_task(urls: list, request_data: Dict[str, Any]):
    """Celery task to scrape multiple URLs"""
    job_ids = []
    
    for url in urls:
        job_id = str(uuid.uuid4())
        request_data_copy = request_data.copy()
        request_data_copy['url'] = url
        
        # Queue individual scrape task
        scrape_url_task.apply_async(
            args=[job_id, request_data_copy],
            task_id=job_id
        )
        
        job_ids.append(job_id)
    
    return {
        "job_ids": job_ids,
        "total": len(job_ids)
    }

class TaskManager:
    """Manager for Celery tasks"""
    
    @staticmethod
    def create_scrape_job(request: ScrapeRequest) -> str:
        """Create a new scrape job"""
        job_id = str(uuid.uuid4())
        
        # Convert request to dict
        request_data = request.model_dump(mode='json')
        
        # Queue task
        scrape_url_task.apply_async(
            args=[job_id, request_data],
            task_id=job_id,
            priority=request.priority
        )
        
        logger.info(f"Created scrape job {job_id}")
        return job_id
    
    @staticmethod
    def create_bulk_scrape_job(urls: list, request_template: Dict[str, Any]) -> list:
        """Create bulk scrape jobs"""
        job_ids = []
        
        for url in urls:
            request_data = request_template.copy()
            request_data['url'] = url
            
            job_id = str(uuid.uuid4())
            scrape_url_task.apply_async(
                args=[job_id, request_data],
                task_id=job_id,
                priority=request_template.get('priority', 5)
            )
            job_ids.append(job_id)
        
        logger.info(f"Created {len(job_ids)} bulk scrape jobs")
        return job_ids
    
    @staticmethod
    def get_job_status(job_id: str) -> Dict[str, Any]:
        """Get status of a scrape job"""
        result = AsyncResult(job_id, app=celery_app)
        
        return {
            "job_id": job_id,
            "status": result.state,
            "result": result.result if result.ready() else None,
            "error": str(result.info) if result.failed() else None,
            "created_at": None,
            "completed_at": None,
        }
    
    @staticmethod
    def cancel_job(job_id: str) -> bool:
        """Cancel a scrape job"""
        result = AsyncResult(job_id, app=celery_app)
        result.revoke(terminate=True)
        logger.info(f"Cancelled job {job_id}")
        return True
