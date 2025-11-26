import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional
import logging
from abc import ABC, abstractmethod
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from playwright.sync_api import sync_playwright
import time

from core.config import settings
from core.enums.scraper_enums import ScraperType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    """Base class for all scrapers"""
    
    def __init__(self, url: str, headers: Optional[Dict[str, str]] = None, 
                 cookies: Optional[Dict[str, str]] = None, proxy: Optional[str] = None):
        self.url = url
        self.headers = headers or {"User-Agent": settings.USER_AGENT}
        self.cookies = cookies
        self.proxy = proxy
        
    @abstractmethod
    def scrape(self, selectors: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Scrape the URL and return data"""
        pass
    
    @abstractmethod
    def cleanup(self):
        """Cleanup resources"""
        pass

class RequestsScraper(BaseScraper):
    """Scraper using requests library"""
    
    def scrape(self, selectors: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Scrape using requests and BeautifulSoup"""
        try:
            logger.info(f"Scraping {self.url} with requests")
            
            proxies = {"http": self.proxy, "https": self.proxy} if self.proxy else None
            
            response = requests.get(
                self.url,
                headers=self.headers,
                cookies=self.cookies,
                proxies=proxies,
                timeout=settings.REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            data = {
                "url": self.url,
                "status_code": response.status_code,
                "html": response.text,
                "title": soup.title.string if soup.title else None
            }
            
            # Extract data based on selectors
            if selectors:
                extracted_data = {}
                for key, selector in selectors.items():
                    elements = soup.select(selector)
                    if elements:
                        extracted_data[key] = [elem.get_text(strip=True) for elem in elements]
                data["extracted_data"] = extracted_data
            
            return data
            
        except Exception as e:
            logger.error(f"Error scraping {self.url}: {str(e)}")
            raise
    
    def cleanup(self):
        """No cleanup needed for requests"""
        pass

class SeleniumScraper(BaseScraper):
    """Scraper using Selenium"""
    
    def __init__(self, *args, wait_time: int = 0, **kwargs):
        super().__init__(*args, **kwargs)
        self.wait_time = wait_time
        self.driver = None
        
    def _init_driver(self):
        """Initialize Selenium WebDriver"""
        chrome_options = ChromeOptions()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument(f'user-agent={self.headers.get("User-Agent", settings.USER_AGENT)}')
        
        if self.proxy:
            chrome_options.add_argument(f'--proxy-server={self.proxy}')
        
        self.driver = webdriver.Chrome(options=chrome_options)
        
    def scrape(self, selectors: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Scrape using Selenium"""
        try:
            logger.info(f"Scraping {self.url} with Selenium")
            
            self._init_driver()
            self.driver.get(self.url)
            
            if self.wait_time > 0:
                time.sleep(self.wait_time)
            
            # Wait for page to load
            WebDriverWait(self.driver, settings.REQUEST_TIMEOUT).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            data = {
                "url": self.url,
                "title": self.driver.title,
                "html": self.driver.page_source
            }
            
            # Extract data based on selectors
            if selectors:
                extracted_data = {}
                for key, selector in selectors.items():
                    try:
                        elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        extracted_data[key] = [elem.text for elem in elements if elem.text]
                    except Exception as e:
                        logger.warning(f"Error extracting {key}: {str(e)}")
                        extracted_data[key] = []
                data["extracted_data"] = extracted_data
            
            return data
            
        except Exception as e:
            logger.error(f"Error scraping {self.url}: {str(e)}")
            raise
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Close the browser"""
        if self.driver:
            self.driver.quit()

class PlaywrightScraper(BaseScraper):
    """Scraper using Playwright"""
    
    def __init__(self, *args, wait_time: int = 0, **kwargs):
        super().__init__(*args, **kwargs)
        self.wait_time = wait_time
        self.playwright = None
        self.browser = None
        
    def scrape(self, selectors: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Scrape using Playwright"""
        try:
            logger.info(f"Scraping {self.url} with Playwright")
            
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                
                context_options = {
                    "user_agent": self.headers.get("User-Agent", settings.USER_AGENT)
                }
                
                if self.proxy:
                    context_options["proxy"] = {"server": self.proxy}
                
                context = browser.new_context(**context_options)
                page = context.new_page()
                
                page.goto(self.url, timeout=settings.REQUEST_TIMEOUT * 1000)
                
                if self.wait_time > 0:
                    page.wait_for_timeout(self.wait_time * 1000)
                
                data = {
                    "url": self.url,
                    "title": page.title(),
                    "html": page.content()
                }
                
                # Extract data based on selectors
                if selectors:
                    extracted_data = {}
                    for key, selector in selectors.items():
                        try:
                            elements = page.query_selector_all(selector)
                            extracted_data[key] = [elem.inner_text() for elem in elements]
                        except Exception as e:
                            logger.warning(f"Error extracting {key}: {str(e)}")
                            extracted_data[key] = []
                    data["extracted_data"] = extracted_data
                
                browser.close()
                return data
                
        except Exception as e:
            logger.error(f"Error scraping {self.url}: {str(e)}")
            raise
    
    def cleanup(self):
        """Cleanup is handled in the context manager"""
        pass

class ScraperFactory:
    """Factory class to create scrapers"""
    
    @staticmethod
    def create_scraper(scraper_type: ScraperType, url: str, 
                      headers: Optional[Dict[str, str]] = None,
                      cookies: Optional[Dict[str, str]] = None,
                      proxy: Optional[str] = None,
                      wait_time: int = 0) -> BaseScraper:
        """Create a scraper based on type"""
        
        if scraper_type == ScraperType.REQUESTS:
            return RequestsScraper(url, headers, cookies, proxy)
        elif scraper_type == ScraperType.SELENIUM:
            return SeleniumScraper(url, headers, cookies, proxy, wait_time=wait_time)
        elif scraper_type == ScraperType.PLAYWRIGHT:
            return PlaywrightScraper(url, headers, cookies, proxy, wait_time=wait_time)
        else:
            raise ValueError(f"Unsupported scraper type: {scraper_type}")
