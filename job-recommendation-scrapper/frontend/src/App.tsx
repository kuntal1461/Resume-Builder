import { useState } from 'react';
import './App.css';
import ScrapeForm from './components/ScrapeForm';
import JobsList from './components/JobsList';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJobCreated = (jobId: string) => {
    console.log('New job created:', jobId);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 className="app-title">
              <span className="gradient-text">Job Recommendation</span>
              <br />
              <span className="subtitle">Scraper Platform</span>
            </h1>
            <p className="app-description">
              Powerful web scraping API for job listings across multiple platforms
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-content">
                <div className="stat-value">Fast</div>
                <div className="stat-label">Multiple Scrapers</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-value">Async</div>
                <div className="stat-label">Queue System</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">Accurate</div>
                <div className="stat-label">Smart Extraction</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <ScrapeForm onJobCreated={handleJobCreated} />
          <JobsList refreshTrigger={refreshTrigger} />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Job Recommendation Scraper © 2024</p>
          <p className="footer-links">
            <a href="#docs">Documentation</a>
            <span>•</span>
            <a href="#api">API Reference</a>
            <span>•</span>
            <a href="#support">Support</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
