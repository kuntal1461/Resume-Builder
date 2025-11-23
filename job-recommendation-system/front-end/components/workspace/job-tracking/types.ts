export type StageKey = 'Job Liked' | 'Shortlist' | 'Auto Apply' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';

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

export type LikedJobSnapshot = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  tags?: string[];
  matchScore: number;
  matchBadge: string;
  savedAt: number;
};
