import { CommunitySection } from '@/components/community-section';
import { FaqSection } from '@/components/faq-section';
import { HeroSection } from '@/components/hero-section';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { PrivacySection } from '@/components/privacy-section';
import { ResumeMatcherSection } from '@/components/resume-matcher-section';
import { StatsSection } from '@/components/stats-section';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <ResumeMatcherSection />
        <PrivacySection />
        <FaqSection />
        <CommunitySection />
      </main>
      <LandingFooter />
      <Toaster />
    </div>
  );
}
