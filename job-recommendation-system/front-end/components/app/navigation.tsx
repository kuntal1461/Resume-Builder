import type { ReactNode } from 'react';
import {
  AutoApplyIcon,
  CaretIcon,
  CareerProfileIcon,
  CoachingIcon,
  DashboardIcon,
  DocumentsIcon,
  InterviewIcon,
  JobMethodIcon,
  JobTrackerIcon,
  JobsIcon,
  OfferAnalyzerIcon,
  OtherIcon,
  ResumeDistributionIcon,
  SalaryAnalyzerIcon,
  UnlimitedLearningIcon,
} from './icons';

export type AppMenuItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string;
  subItems?: AppMenuItem[];
};

export type AppProfileTask = {
  delta: string;
  label: string;
  href: string;
};

export const DEFAULT_PROFILE_TASKS: AppProfileTask[] = [
  { delta: '+10%', label: 'Confirm your target role', href: '/app/career-profile/profile' },
  { delta: '+40%', label: 'Add your work experience', href: '/app/career-profile/insights' },
  { delta: '+45%', label: 'Take career assessment', href: '/app/career-profile/cover-letter' },
];

export const APP_MENU_ITEMS: AppMenuItem[] = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Career Profile',
    href: '/app/career-profile/profile',
    icon: <CareerProfileIcon />,
    subItems: [
      { label: 'My Career Insights', href: '/app/career-profile/insights' },
      { label: 'My Professional Pitch', href: '/app/career-profile/pitch' },
      { label: 'My AI Cover Letter', href: '/app/career-profile/cover-letter' },
    ],
  },
  {
    label: 'Documents',
    href: '/app',
    icon: <DocumentsIcon />,
    subItems: [
      { label: 'My Resumes', href: '/app/resumes' },
      { label: 'My Cover Letters', href: '/app/cover-letters' },
      { label: 'Hire Resume Writer', href: '/app/hire-resume-writer' },
    ],
  },
  {
    label: 'Jobs',
    href: '/app/job-search?view=recommendation',
    icon: <JobsIcon />,
  },
  {
    label: 'Job Tracker',
    href: '/app/job-tracking',
    icon: <JobTrackerIcon />,
  },
  {
    label: 'Interview Prep',
    href: '/app/interview-preparation/dashboard',
    icon: <InterviewIcon />,
  },
  {
    label: 'Offer Analyzer',
    href: '/app/offer-analyzer',
    icon: <OfferAnalyzerIcon />,
  },
  {
    label: 'Resume Distribution',
    href: '/app/resume-distribution',
    icon: <ResumeDistributionIcon />,
  },
  {
    label: 'Salary Analyzer',
    href: '/app/offer-analyzer/salary',
    icon: <SalaryAnalyzerIcon />,
  },
  {
    label: 'Unlimited Learning',
    href: '/app/unlimited-learning',
    icon: <UnlimitedLearningIcon />,
    badge: 'New',
  },
  {
    label: 'Job Search Method',
    href: '/app/job-search-method',
    icon: <JobMethodIcon />,
    subItems: [
      { label: 'The Master Plan', href: '/app/career-plans/execute-a-job-search?cp_top_level=1&cp_second_level=1' },
      { label: 'Brand Yourself', href: '/app/career-plans/execute-a-job-search?cp_top_level=2&cp_second_level=3' },
      { label: 'Get More Meetings', href: '/app/career-plans/execute-a-job-search?cp_top_level=3&cp_second_level=7' },
      { label: 'Interview and Win', href: '/app/career-plans/execute-a-job-search?cp_top_level=4&cp_second_level=11' },
      { label: 'Close the Deal', href: '/app/career-plans/execute-a-job-search?cp_top_level=5&cp_second_level=12' },
    ],
  },
  {
    label: 'Coaching',
    href: '/app/career-coaching',
    icon: <CoachingIcon />,
  },
  {
    label: 'Other',
    href: '/app',
    icon: <OtherIcon />,
    subItems: [
      { label: 'Custom Career Plan', href: '/app/career-plans/custom-plan' },
      { label: 'Career Advice Blog', href: '/app/blog' },
      { label: 'Career Pathways', href: '/app/career-path' },
      { label: 'Explore Careers', href: '/app/explore-careers' },
      { label: 'First 90 Days', href: '/app/career-plans/first-90-days' },
      { label: 'Get a Promotion', href: '/app/career-plans/path-to-promotion' },
    ],
  },
  {
    label: 'Get Auto Apply Extension',
    href: '/app/extension',
    icon: <AutoApplyIcon />,
  },
];

export const CARET_ICON = <CaretIcon />;
