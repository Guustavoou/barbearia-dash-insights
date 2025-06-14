import React from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { OnboardingProvider } from "@/contexts/OnboardingContext";

interface OnboardingPageProps {
  onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onComplete,
}) => {
  return (
    <OnboardingProvider>
      <OnboardingFlow onComplete={onComplete} />
    </OnboardingProvider>
  );
};
