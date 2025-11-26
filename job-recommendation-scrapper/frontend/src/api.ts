const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ScrapeRequest {
    url: string;
    scraper_type?: 'requests' | 'selenium' | 'playwright' | 'scrapy';
    selectors?: Record<string, string>;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
    proxy?: string;
    javascript_enabled?: boolean;
    wait_time?: number;
    max_retries?: number;
    priority?: number;
    metadata?: Record<string, any>;
}

export interface BulkScrapeRequest extends Omit<ScrapeRequest, 'url'> {
    urls: string[];
    batch_size?: number;
}

export interface ScrapeJob {
    job_id: string;
    url: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
    created_at: string;
    completed_at?: string;
    result?: any;
    error?: string;
}

export interface JobListing {
    _id: string;
    title: string;
    company: string;
    location?: string;
    description?: string;
    salary?: string;
    jobType?: string;
    experienceLevel?: string;
    skills?: string[];
    postedDate?: string;
    applicationUrl?: string;
    sourceUrl: string;
    scrapedAt: string;
}

class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Scrape single URL
    async scrapeURL(request: ScrapeRequest): Promise<{ job_id: string; status: string; message: string }> {
        return this.request('/scrape', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Scrape multiple URLs
    async scrapeBulk(request: BulkScrapeRequest): Promise<{ job_ids: string[]; total_jobs: number }> {
        return this.request('/scrape/bulk', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Get job status
    async getJobStatus(jobId: string): Promise<ScrapeJob> {
        return this.request(`/jobs/${jobId}`);
    }

    // Cancel job
    async cancelJob(jobId: string): Promise<{ cancelled: boolean; message: string }> {
        return this.request(`/jobs/${jobId}`, {
            method: 'DELETE',
        });
    }

    // List all jobs
    async listJobs(params?: {
        status?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<{ jobs: ScrapeJob[]; pagination: any }> {
        const queryParams = new URLSearchParams(params as any).toString();
        return this.request(`/jobs?${queryParams}`);
    }

    // List job listings
    async listJobListings(params?: {
        company?: string;
        location?: string;
        search?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<{ listings: JobListing[]; pagination: any }> {
        const queryParams = new URLSearchParams(params as any).toString();
        return this.request(`/listings?${queryParams}`);
    }
}

export const apiClient = new APIClient(API_BASE_URL);
