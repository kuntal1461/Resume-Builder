import { useState } from 'react';
import './ScrapeForm.css';
import { apiClient, ScrapeRequest } from '../api';

interface ScrapeFormProps {
    onJobCreated: (jobId: string) => void;
}

export default function ScrapeForm({ onJobCreated }: ScrapeFormProps) {
    const [formData, setFormData] = useState<ScrapeRequest>({
        url: '',
        scraper_type: 'requests',
        wait_time: 0,
        max_retries: 3,
        priority: 5,
        javascript_enabled: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await apiClient.scrapeURL(formData);
            setSuccess(`Job created successfully! Job ID: ${response.job_id}`);
            onJobCreated(response.job_id);

            // Reset form
            setFormData({
                url: '',
                scraper_type: 'requests',
                wait_time: 0,
                max_retries: 3,
                priority: 5,
                javascript_enabled: false,
            });
        } catch (err: any) {
            setError(err.message || 'Failed to create scrape job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="scrape-form-container card fade-in">
            <h2 className="gradient-text">Submit Scraping Job</h2>

            <form onSubmit={handleSubmit} className="scrape-form">
                <div className="form-group">
                    <label htmlFor="url">URL to Scrape *</label>
                    <input
                        id="url"
                        type="url"
                        className="input"
                        placeholder="https://example.com/jobs"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="scraper_type">Scraper Type</label>
                        <select
                            id="scraper_type"
                            className="input"
                            value={formData.scraper_type}
                            onChange={(e) => setFormData({ ...formData, scraper_type: e.target.value as any })}
                        >
                            <option value="requests">Requests (Fast)</option>
                            <option value="selenium">Selenium (JavaScript)</option>
                            <option value="playwright">Playwright (Modern)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority">Priority (1-10)</label>
                        <input
                            id="priority"
                            type="number"
                            className="input"
                            min="1"
                            max="10"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="wait_time">Wait Time (seconds)</label>
                        <input
                            id="wait_time"
                            type="number"
                            className="input"
                            min="0"
                            max="30"
                            value={formData.wait_time}
                            onChange={(e) => setFormData({ ...formData, wait_time: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="max_retries">Max Retries</label>
                        <input
                            id="max_retries"
                            type="number"
                            className="input"
                            min="0"
                            max="10"
                            value={formData.max_retries}
                            onChange={(e) => setFormData({ ...formData, max_retries: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.javascript_enabled}
                            onChange={(e) => setFormData({ ...formData, javascript_enabled: e.target.checked })}
                        />
                        <span>Enable JavaScript Execution</span>
                    </label>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✓</span>
                        {success}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-small"></span>
                            Submitting...
                        </>
                    ) : (
                        'Submit Scrape Job'
                    )}
                </button>
            </form>
        </div>
    );
}
