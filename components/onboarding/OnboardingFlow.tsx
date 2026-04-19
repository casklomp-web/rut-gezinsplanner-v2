'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, ChevronRight, Sparkles, User, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Step = 'welcome' | 'family' | 'goals' | 'complete';

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [familySize, setFamilySize] = useState(2);
  const [hasKids, setHasKids] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);

  const steps: { id: Step; title: string }[] = [
    { id: 'welcome', title: 'Welkom' },
    { id: 'family', title: 'Gezin' },
    { id: 'goals', title: 'Doelen' },
    { id: 'complete', title: 'Klaar' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F8F9FA] z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index <= currentStepIndex ? "bg-[#4A90A4]" : "bg-gray-300"
              )}
            />
          ))}
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Overslaan
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        {currentStep === 'welcome' && (
          <WelcomeStep onNext={handleNext} />
        )}
        {currentStep === 'family' && (
          <FamilyStep
            familySize={familySize}
            setFamilySize={setFamilySize}
            hasKids={hasKids}
            setHasKids={setHasKids}
          />
        )}
        {currentStep === 'goals' && (
          <GoalsStep goals={goals} toggleGoal={toggleGoal} />
        )}
        {currentStep === 'complete' && (
          <CompleteStep onComplete={onComplete} />
        )}
      </div>

      {/* Footer */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3 max-w-md mx-auto">
            <Button variant="outline" className="flex-1" onClick={handleBack}>
              Terug
            </Button>
            <Button className="flex-1" onClick={handleNext}>
              {currentStepIndex === steps.length - 2 ? 'Afronden' : 'Volgende'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-[#4A90A4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-[#4A90A4]" />
      </div>
      <h1 className="text-3xl font-bold text-[#2D3436] mb-4">
        Welkom bij Rut
      </h1>
      <p className="text-gray-600 mb-8 max-w-xs mx-auto">
        Je persoonlijke gezinsplanner voor een gezonder leven. Laten we samen je eerste week opzetten.
      </p>
      <Button size="lg" onClick={onNext} className="w-full max-w-xs">
        Aan de slag
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

function FamilyStep({
  familySize,
  setFamilySize,
  hasKids,
  setHasKids,
}: {
  familySize: number;
  setFamilySize: (size: number) => void;
  hasKids: boolean;
  setHasKids: (has: boolean) => void;
}) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#2D3436] mb-2">Jouw gezin</h2>
      <p className="text-gray-600 mb-8">
        Hoe groot is je gezin? Dit helpt ons om de juiste porties te berekenen.
      </p>

      {/* Family size */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Aantal personen
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((size) => (
            <button
              key={size}
              onClick={() => setFamilySize(size)}
              className={cn(
                "w-12 h-12 rounded-xl font-semibold transition-colors",
                familySize === size
                  ? "bg-[#4A90A4] text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#4A90A4]"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Kids */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Zijn er kinderen in het gezin?
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setHasKids(true)}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2",
              hasKids
                ? "border-[#4A90A4] bg-[#4A90A4]/5"
                : "border-gray-200 hover:border-[#4A90A4]"
            )}
          >
            <Users className="w-6 h-6 text-[#4A90A4]" />
            <span className="font-medium">Ja</span>
          </button>
          <button
            onClick={() => setHasKids(false)}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2",
              !hasKids
                ? "border-[#4A90A4] bg-[#4A90A4]/5"
                : "border-gray-200 hover:border-[#4A90A4]"
            )}
          >
            <User className="w-6 h-6 text-[#4A90A4]" />
            <span className="font-medium">Nee</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalsStep({
  goals,
  toggleGoal,
}: {
  goals: string[];
  toggleGoal: (goal: string) => void;
}) {
  const availableGoals = [
    { id: 'weight', label: 'Gewicht verliezen', icon: Target },
    { id: 'muscle', label: 'Spieren opbouwen', icon: Target },
    { id: 'energy', label: 'Meer energie', icon: Target },
    { id: 'routine', label: 'Betere routine', icon: Target },
    { id: 'family', label: 'Gezonder gezin', icon: Target },
    { id: 'budget', label: 'Binnen budget', icon: Target },
  ];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-[#2D3436] mb-2">Jouw doelen</h2>
      <p className="text-gray-600 mb-8">
        Waar wil je aan werken? Selecteer alle doelen die bij je passen.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {availableGoals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = goals.includes(goal.id);
          
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                "p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 text-center",
                isSelected
                  ? "border-[#4A90A4] bg-[#4A90A4]/5"
                  : "border-gray-200 hover:border-[#4A90A4]"
              )}
            >
              <Icon className="w-6 h-6 text-[#4A90A4]" />
              <span className="text-sm font-medium">{goal.label}</span>
              {isSelected && (
                <div className="w-5 h-5 bg-[#4A90A4] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompleteStep({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-[#7CB342]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-12 h-12 text-[#7CB342]" />
      </div>
      <h2 className="text-3xl font-bold text-[#2D3436] mb-4">
        Je bent er klaar voor!
      </h2>
      <p className="text-gray-600 mb-8 max-w-xs mx-auto">
        We hebben alles wat we nodig hebben. Laten we je eerste week genereren.
      </p>
      <Button size="lg" onClick={onComplete} className="w-full max-w-xs">
        <Sparkles className="w-5 h-5 mr-2" />
        Genereer mijn week
      </Button>
    </div>
  );
}
