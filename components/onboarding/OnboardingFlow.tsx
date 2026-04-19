/**
 * Onboarding Flow
 * Welcome and tutorial for new users
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, Home, Calendar, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welkom bij Rut!',
    description: 'Je persoonlijke gezinsplanner voor een gezonde leefstijl. Laten we samen je eerste week plannen.',
    icon: Home
  },
  {
    id: 'household',
    title: 'Jouw huishouden',
    description: 'Voeg je gezinsleden toe zodat we rekening kunnen houden met ieders voorkeuren en doelen.',
    icon: Heart
  },
  {
    id: 'preferences',
    title: 'Jouw voorkeuren',
    description: 'Stel je dieetwensen, allergieën en tijdsbeschikbaarheid in voor gepersonaliseerde maaltijden.',
    icon: Calendar
  },
  {
    id: 'planning',
    title: 'Weekplanning',
    description: 'Wij genereren automatisch een weekmenu met boodschappenlijst. Jij kunt alles eenvoudig aanpassen.',
    icon: Calendar
  },
  {
    id: 'shopping',
    title: 'Boodschappen',
    description: 'Je boodschappenlijst is georganneerd per winkel en in looproute. Afvinken maar!',
    icon: ShoppingCart
  }
];

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  const step = steps[currentStep];
  const Icon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setDirection('next');
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrev = () => {
    if (!isFirstStep) {
      setDirection('prev');
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-[#4A90A4] flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onSkip}
          className="text-white/80 hover:text-white text-sm font-medium"
        >
          Overslaan
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((s, index) => (
              <div
                key={s.id}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentStep
                    ? 'w-8 bg-white'
                    : index < currentStep
                    ? 'bg-white/60'
                    : 'bg-white/30'
                )}
              />
            ))}
          </div>
          
          {/* Step content */}
          <div
            className={cn(
              'text-center transition-all duration-300',
              direction === 'next' ? 'animate-in slide-in-from-right' : 'animate-in slide-in-from-left'
            )}
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              {step.title}
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="p-6 pb-8">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={cn(
              'p-3 rounded-full transition-colors',
              isFirstStep
                ? 'opacity-0 pointer-events-none'
                : 'bg-white/20 hover:bg-white/30 text-white'
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <Button
            onClick={handleNext}
            className="bg-white text-[#4A90A4] hover:bg-white/90 px-8"
            size="lg"
          >
            {isLastStep ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Aan de slag
              </>
            ) : (
              <>
                Volgende
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          <div className="w-12" /> {/* Spacer for alignment */}
        </div>
      </div>
    </div>
  );
}

// Tutorial tooltip component
interface TutorialTooltipProps {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext: () => void;
  onSkip: () => void;
  step: number;
  totalSteps: number;
}

export function TutorialTooltip({
  target,
  title,
  description,
  position = 'bottom',
  onNext,
  onSkip,
  step,
  totalSteps
}: TutorialTooltipProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const element = document.querySelector(target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
      
      // Highlight target element
      element.classList.add('tutorial-highlight');
    }
    
    return () => {
      const el = document.querySelector(target);
      el?.classList.remove('tutorial-highlight');
    };
  }, [target]);
  
  const positionClasses = {
    top: 'bottom-full mb-2 -translate-x-1/2',
    bottom: 'top-full mt-2 -translate-x-1/2',
    left: 'right-full mr-2 -translate-y-1/2',
    right: 'left-full ml-2 -translate-y-1/2'
  };
  
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onSkip} />
      
      {/* Tooltip */}
      <div
        className={cn(
          'fixed z-50 w-72 bg-white rounded-xl shadow-2xl p-4',
          positionClasses[position]
        )}
        style={{
          left: coords.x,
          top: coords.y
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#4A90A4]">
            Stap {step} van {totalSteps}
          </span>
          <button
            onClick={onSkip}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Overslaan
          </button>
        </div>
        
        <h3 className="font-semibold text-[#2D3436] mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  i < step ? 'bg-[#4A90A4]' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
          
          <Button size="sm" onClick={onNext}>
            {step === totalSteps ? 'Klaar' : 'Volgende'}
          </Button>
        </div>
      </div>
    </>
  );
}
