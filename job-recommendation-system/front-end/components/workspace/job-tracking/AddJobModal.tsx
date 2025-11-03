import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import styles from '../../../styles/workspace/JobTracking.module.css';
import type { AddJobSubmission, StageKey } from './types';

type AddJobModalProps = {
  open: boolean;
  stage: StageKey;
  stages: StageKey[];
  onClose: () => void;
  onSubmit: (job: AddJobSubmission) => void;
};

type AddJobFormState = {
  stage: StageKey;
  title: string;
  company: string;
  location: string;
  salary: string;
  nextStep: string;
  tags: string;
  interviewDate: string;
  interviewTime: string;
  needsReminder: boolean;
};

const getInitialState = (stage: StageKey): AddJobFormState => ({
  stage,
  title: '',
  company: '',
  location: '',
  salary: '',
  nextStep: '',
  tags: '',
  interviewDate: '',
  interviewTime: '',
  needsReminder: false,
});

export default function AddJobModal({ open, stage, stages, onClose, onSubmit }: AddJobModalProps) {
  const [formState, setFormState] = useState<AddJobFormState>(getInitialState(stage));

  useEffect(() => {
    if (open) {
      document.body.style.setProperty('overflow', 'hidden');
      setFormState(getInitialState(stage));
    }

    return () => {
      document.body.style.removeProperty('overflow');
    }
  }, [open, stage]);

  if (!open) {
    return null;
  }

  const handleFieldChange =
    (field: keyof AddJobFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setFormState((previous) => ({
        ...previous,
        [field]: field === 'stage' ? (value as StageKey) : value,
      }));
    };

  const handleReminderToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormState((previous) => ({
      ...previous,
      needsReminder: checked,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = formState.title.trim();
    const company = formState.company.trim();
    const location = formState.location.trim();
    const salary = formState.salary.trim();
    const nextStep = formState.nextStep.trim() || 'Set next follow-up';
    const tags = formState.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const interviewDate =
      formState.stage === 'Interview' && formState.interviewDate ? formState.interviewDate : undefined;
    const interviewTime =
      formState.stage === 'Interview' && formState.interviewTime ? formState.interviewTime : undefined;
    const needsReminder = formState.stage === 'Interview' ? formState.needsReminder : undefined;

    onSubmit({
      stage: formState.stage,
      title,
      company,
      location,
      salary: salary ? salary : undefined,
      nextStep,
      tags: tags.length ? tags : undefined,
      interviewDate,
      interviewTime,
      needsReminder,
    });
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-job-modal-title"
        aria-describedby="add-job-modal-description"
        className={styles.modalPanel}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.modalAccent} aria-hidden="true" />
        <header className={styles.modalHeader}>
          <div>
            <p className={styles.modalOverline}>Add opportunity</p>
            <h2 id="add-job-modal-title" className={styles.modalTitle}>
              Capture a new role
            </h2>
            <p id="add-job-modal-description" className={styles.modalSubtitle}>
              Log the basics so your pipeline stays current and we can surface the right nudges.
            </p>
          </div>
          <button type="button" className={styles.modalClose} aria-label="Close add job dialog" onClick={onClose}>
            &times;
          </button>
        </header>
        <div className={styles.modalStagePreview}>
          <span className={styles.modalStageLabel}>Current stage</span>
          <span className={styles.modalStagePill}>{formState.stage}</span>
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.modalFieldGroup}>
            <label htmlFor="add-job-stage" className={styles.modalLabel}>
              Stage
            </label>
            <select
              id="add-job-stage"
              className={styles.modalInput}
              value={formState.stage}
              onChange={handleFieldChange('stage')}
            >
              {stages.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.modalFieldGrid}>
            <div className={styles.modalFieldGroup}>
              <label htmlFor="add-job-title" className={styles.modalLabel}>
                Job title
              </label>
              <input
                id="add-job-title"
                className={styles.modalInput}
                value={formState.title}
                onChange={handleFieldChange('title')}
                required
              />
            </div>
            <div className={styles.modalFieldGroup}>
              <label htmlFor="add-job-company" className={styles.modalLabel}>
                Company
              </label>
              <input
                id="add-job-company"
                className={styles.modalInput}
                value={formState.company}
                onChange={handleFieldChange('company')}
                required
              />
            </div>
          </div>
          <div className={styles.modalFieldGrid}>
            <div className={styles.modalFieldGroup}>
              <label htmlFor="add-job-location" className={styles.modalLabel}>
                Location
              </label>
              <input
                id="add-job-location"
                className={styles.modalInput}
                value={formState.location}
                onChange={handleFieldChange('location')}
                required
              />
            </div>
            <div className={styles.modalFieldGroup}>
              <label htmlFor="add-job-salary" className={styles.modalLabel}>
                Salary range (optional)
              </label>
              <input
                id="add-job-salary"
                className={styles.modalInput}
                value={formState.salary}
                onChange={handleFieldChange('salary')}
                placeholder="$120k – $135k"
              />
            </div>
          </div>
          <div className={styles.modalFieldGroup}>
            <label htmlFor="add-job-next-step" className={styles.modalLabel}>
              Next step
            </label>
            <textarea
              id="add-job-next-step"
              className={styles.modalTextarea}
              value={formState.nextStep}
              onChange={handleFieldChange('nextStep')}
              rows={3}
              required
            />
          </div>
          {formState.stage === 'Interview' ? (
            <div className={styles.modalInterviewSection}>
              <p className={styles.modalSectionTitle}>Interview logistics</p>
              <div className={styles.modalFieldGrid}>
                <div className={styles.modalFieldGroup}>
                  <label htmlFor="add-job-interview-date" className={styles.modalLabel}>
                    Interview date
                  </label>
                  <input
                    id="add-job-interview-date"
                    type="date"
                    className={styles.modalInput}
                    value={formState.interviewDate}
                    onChange={handleFieldChange('interviewDate')}
                  />
                </div>
                <div className={styles.modalFieldGroup}>
                  <label htmlFor="add-job-interview-time" className={styles.modalLabel}>
                    Interview time
                  </label>
                  <input
                    id="add-job-interview-time"
                    type="time"
                    className={styles.modalInput}
                    value={formState.interviewTime}
                    onChange={handleFieldChange('interviewTime')}
                  />
                </div>
              </div>
              <label className={styles.modalToggle}>
                <input
                  type="checkbox"
                  checked={formState.needsReminder}
                  onChange={handleReminderToggle}
                />
                <span className={styles.modalToggleText}>
                  Need an alert for this interview?
                  <small>We&apos;ll remind you to prep and send a follow-up.</small>
                </span>
              </label>
            </div>
          ) : null}
          <div className={styles.modalFieldGroup}>
            <label htmlFor="add-job-tags" className={styles.modalLabel}>
              Tags (comma separated)
            </label>
            <input
              id="add-job-tags"
              className={styles.modalInput}
              value={formState.tags}
              onChange={handleFieldChange('tags')}
              placeholder="Remote, Referral, Priority"
            />
            <span className={styles.modalHint}>Press enter to save — we auto format the list for you.</span>
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.ghostButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Save opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
