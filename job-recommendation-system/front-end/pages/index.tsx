import type { GetStaticProps } from 'next';
import Head from 'next/head';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import HeroSection from '../components/home/HeroSection';
import UploadPrompt from '../components/home/UploadPrompt';
import FeatureHighlights from '../components/home/FeatureHighlights';
import WorkflowSection from '../components/home/WorkflowSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PricingTeaser from '../components/home/PricingTeaser';
import FaqSection from '../components/home/FaqSection';
import FinalCallToAction from '../components/home/FinalCallToAction';

interface HomePageProps {
  currentYear: number;
}

export default function HomePage({ currentYear }: HomePageProps) {
  return (
    <>
      <Head>
        <title>JobMatch · AI Resume Builder & Job Recommendation Hub</title>
        <meta
          name="description"
          content="Create a job-winning resume with AI guidance and receive curated job recommendations matched to your career goals."
        />
      </Head>
      <SiteHeader />
      <main>
        <HeroSection />
        <UploadPrompt />
        <FeatureHighlights />
        <WorkflowSection />
        <TestimonialsSection />
        <PricingTeaser />
        <FaqSection />
        <FinalCallToAction />
      </main>
      <SiteFooter currentYear={currentYear} />
    </>
  );
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  return {
    props: {
      currentYear: new Date().getFullYear(),
    },
  };
};
