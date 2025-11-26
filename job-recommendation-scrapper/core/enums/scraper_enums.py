from enum import Enum

class ScraperStatus(str, Enum):
    """Status of scraping job"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ScraperType(str, Enum):
    """Type of scraper to use"""
    REQUESTS = "requests"
    SELENIUM = "selenium"
    PLAYWRIGHT = "playwright"
    SCRAPY = "scrapy"
