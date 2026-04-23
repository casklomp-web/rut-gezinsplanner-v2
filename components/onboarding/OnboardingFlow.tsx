'use client';

import { useEffect } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  // MVP: Skip onboarding, go straight to app
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
}
