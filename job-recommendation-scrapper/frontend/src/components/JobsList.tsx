import { useState, useEffect } from 'react';
import './JobsList.css';
import { apiClient, ScrapeJob } from '../api';

interface JobsListProps {
    refreshTrigger?: number;
}

export default function JobsList({ refreshTrigger }: JobsListProps) {
    const [jobs, setJobs] = useState<ScrapeJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params: any = { page, limit: 10, sort: '-createdAt' };
            if (filter !== 'all') {
                params.status = filter;
            }

            const response = await apiClient.listJobs(params);
            setJobs(response.jobs);
            setTotalPages(response.pagination.pages);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, filter, refreshTrigger]);

    const handleCancelJob = async (jobId: string) => {
        if (!confirm('Are you sure you want to cancel this job?')) return;

        try {
            await apiClient.cancelJob(jobId);
            fetchJobs();
        } catch (err: any) {
            alert(err.message || 'Failed to cancel job');
        }
    };

    const getStatusBadgeClass = (status: string) => {
        return `badge badge-${status.toLowerCase().replace('_', '-')}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading && jobs.length === 0) {
        return (
            <div className="jobs-list-container card">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-list-container card fade-in">
            <div className="jobs-header">
                <h2 className="gradient-text">Scraping Jobs</h2>

                <div className="filter-controls">
                    <select
                        className="input filter-select"
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <button className="btn btn-secondary" onClick={fetchJobs}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    {error}
                </div>
            )}

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <p>No jobs found</p>
                </div>
            ) : (
                <>
                    <div className="jobs-grid">
                        {jobs.map((job) => (
                            <div key={job.job_id} className="job-card">
                                <div className="job-header">
                                    <span className={getStatusBadgeClass(job.status)}>
                                        {job.status.replace('_', ' ')}
                                    </span>
                                    <span className="job-id">{job.job_id.slice(0, 8)}...</span>
                                </div>

                                <div className="job-url">
                                    <strong>URL:</strong>
                                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                                        {job.url.length > 50 ? job.url.slice(0, 50) + '...' : job.url}
                                    </a>
                                </div>

                                <div className="job-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">Created:</span>
                                        <span>{formatDate(job.created_at)}</span>
                                    </div>

                                    {job.completed_at && (
                                        <div className="meta-item">
                                            <span className="meta-label">Completed:</span>
                                            <span>{formatDate(job.completed_at)}</span>
                                        </div>
                                    )}
                                </div>

                                {job.error && (
                                    <div className="job-error">
                                        <strong>Error:</strong> {job.error}
                                    </div>
                                )}

                                <div className="job-actions">
                                    {(job.status === 'pending' || job.status === 'in_progress') && (
                                        <button
                                            className="btn-small btn-danger"
                                            onClick={() => handleCancelJob(job.job_id)}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    {job.status === 'completed' && job.result && (
                                        <button
                                            className="btn-small btn-success"
                                            onClick={() => {
                                                console.log('Job result:', job.result);
                                                alert('Check console for result');
                                            }}
                                        >
                                            View Result
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>

                            <span className="page-info">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                className="btn btn-secondary"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
