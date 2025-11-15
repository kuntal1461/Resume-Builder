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
  href?: string;
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
  { delta: '+10%', label: 'Confirm your target role', href: '/workspace/career-profile/profile' },
  { delta: '+40%', label: 'Add your work experience', href: '/workspace/career-profile/insights' },
  { delta: '+45%', label: 'Take career assessment', href: '/workspace/career-profile/cover-letter' },
];

export const APP_MENU_ITEMS: AppMenuItem[] = [
  {
    label: 'Workspace Overview',
    href: '/workspace/overview',
    icon: <DashboardIcon />,
  },
  {
    label: 'Career Profile',
    href: '/workspace/career-profile/profile',
    icon: <CareerProfileIcon />,
    subItems: [
      { label: 'My Career Insights', href: '/workspace/career-profile/insights' },
      { label: 'My Professional Pitch', href: '/workspace/career-profile/pitch' },
      { label: 'My AI Cover Letter', href: '/workspace/career-profile/cover-letter' },
    ],
  },
  {
    label: 'Documents',
    href: '/workspace',
    icon: <DocumentsIcon />,
    subItems: [
      { label: 'My Resumes' },
      { label: 'My Cover Letters', href: '/workspace/cover-letters' },
      { label: 'Hire Resume Writer', href: '/workspace/hire-resume-writer' },
    ],
  },
  {
    label: 'Jobs',
    href: '/workspace/job-search?view=recommendation',
    icon: <JobsIcon />,
  },
  {
    label: 'Job Tracker',
    href: '/workspace/job-tracking',
    icon: <JobTrackerIcon />,
  },
  {
    label: 'Create Resume',
    href: '/workspace/create-resume',
    icon: <ResumeDistributionIcon />,
    badge: 'New',
  },
  {
    label: 'Interview Prep',
    href: '/workspace/interview-preparation/dashboard',
    icon: <InterviewIcon />,
  },
  {
    label: 'Offer Analyzer',
    href: '/workspace/offer-analyzer',
    icon: <OfferAnalyzerIcon />,
  },
  {
    label: 'Salary Analyzer',
    href: '/workspace/offer-analyzer/salary',
    icon: <SalaryAnalyzerIcon />,
  },
  {
    label: 'Unlimited Learning',
    href: '/workspace/unlimited-learning',
    icon: <UnlimitedLearningIcon />,
    badge: 'New',
  },
  {
    label: 'Job Search Method',
    href: '/workspace/job-search-method',
    icon: <JobMethodIcon />,
    subItems: [
      { label: 'The Master Plan', href: '/workspace/career-plans/execute-a-job-search?cp_top_level=1&cp_second_level=1' },
      { label: 'Brand Yourself', href: '/workspace/career-plans/execute-a-job-search?cp_top_level=2&cp_second_level=3' },
      { label: 'Get More Meetings', href: '/workspace/career-plans/execute-a-job-search?cp_top_level=3&cp_second_level=7' },
      { label: 'Interview and Win', href: '/workspace/career-plans/execute-a-job-search?cp_top_level=4&cp_second_level=11' },
      { label: 'Close the Deal', href: '/workspace/career-plans/execute-a-job-search?cp_top_level=5&cp_second_level=12' },
    ],
  },
  {
    label: 'Coaching',
    href: '/workspace/career-coaching',
    icon: <CoachingIcon />,
  },
  {
    label: 'Other',
    href: '/workspace',
    icon: <OtherIcon />,
    subItems: [
      { label: 'Custom Career Plan', href: '/workspace/career-plans/custom-plan' },
      { label: 'Career Advice Blog', href: '/workspace/blog' },
      { label: 'Career Pathways', href: '/workspace/career-path' },
      { label: 'Explore Careers', href: '/workspace/explore-careers' },
      { label: 'First 90 Days', href: '/workspace/career-plans/first-90-days' },
      { label: 'Get a Promotion', href: '/workspace/career-plans/path-to-promotion' },
    ],
  },
  {
    label: 'Get Auto Apply Extension',
    href: '/workspace/extension',
    icon: <AutoApplyIcon />,
  },
];

export const CARET_ICON = <CaretIcon />;
