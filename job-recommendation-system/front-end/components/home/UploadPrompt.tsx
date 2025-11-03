import { FormEvent, useEffect, useRef, useState } from 'react';
import styles from '../../styles/Home.module.css';

interface UploadState {
  fileName: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  message: string;
}

const INITIAL_STATE: UploadState = {
  fileName: '',
  status: 'idle',
  message: '',
};

export default function UploadPrompt() {
  const [state, setState] = useState<UploadState>(INITIAL_STATE);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
    []
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('resume') as File | null;
    if (!file || file.size === 0) {
      setState({
        fileName: '',
        status: 'error',
        message: 'Attach your resume to receive a personalized skills report.',
      });
      return;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState({ fileName: file.name, status: 'processing', message: 'Analyzing resume skills graph…' });

    // Simulate async call to demonstrate flow for now.
    timeoutRef.current = window.setTimeout(() => {
      setState({
        fileName: file.name,
        status: 'success',
        message: 'Great news! We found 12 open roles that match your skillset this week.',
      });
      form.reset();
      timeoutRef.current = null;
    }, 1800);
  };

  const statusClass =
    state.status === 'success'
      ? styles.uploadStatusSuccess
      : state.status === 'error'
      ? styles.uploadStatusError
      : state.status === 'processing'
      ? styles.uploadStatusProcessing
      : '';

  return (
    <section id="upload" className={styles.uploadSection}>
      <div className={styles.uploadInner}>
        <div className={styles.uploadCopy}>
          <h2>Upload your resume, we’ll do the matchmaking.</h2>
          <p>
            Our parser reads beyond keywords. Get a breakdown of role recommendations, seniority alignment, and growth
            gaps—in under 30 seconds.
          </p>
          <ul className={styles.uploadBullets}>
            <li>Deep parsing across 42 skill clusters</li>
            <li>Benchmarks against 180K job descriptions</li>
            <li>Instant resume rewrite suggestions aligned to each role</li>
          </ul>
        </div>
        <div className={styles.uploadCard}>
          <form className={styles.uploadForm} onSubmit={handleSubmit}>
            <label htmlFor="resume-upload" className={styles.uploadDropzone}>
              <input id="resume-upload" type="file" name="resume" accept=".pdf,.doc,.docx" />
              <span className={styles.uploadIcon} aria-hidden="true">
                ⬆️
              </span>
              <span>
                Drag & drop your resume PDF or DOCX
                <small>Max 10MB • Secure & private</small>
              </span>
            </label>
            <button type="submit" className={styles.uploadButton} disabled={state.status === 'processing'}>
              {state.status === 'processing' ? 'Scanning…' : 'Get recommendations'}
            </button>
          </form>
          {state.status !== 'idle' && (
            <div className={`${styles.uploadStatus} ${statusClass}`} role="status">
              <strong>{state.fileName || 'No file detected'}</strong>
              <p>{state.message}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
