/**
 * Landing Page - Main landing page (pre-login home screen)
 */

import {
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  SocialProofSection,
  CTASection,
} from './landing';
import { Footer } from '@/components/layout/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </div>
  );
}
