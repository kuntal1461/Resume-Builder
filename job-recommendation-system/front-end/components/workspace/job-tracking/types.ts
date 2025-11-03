export type StageKey = 'Shortlist' | 'Auto Apply' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

export type AddJobSubmission = {
  stage: StageKey;
  title: string;
  company: string;
  location: string;
  salary?: string;
  nextStep: string;
  tags?: string[];
  interviewDate?: string;
  interviewTime?: string;
  needsReminder?: boolean;
};
