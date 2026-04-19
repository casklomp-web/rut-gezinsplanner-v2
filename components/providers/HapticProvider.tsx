'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isFeatureEnabled } from './FeatureProvider';

interface HapticContextType {
  vibrate: (pattern?: number | number[]) => void;
  isSupported: boolean;
}

const HapticContext = createContext<HapticContextType>({
  vibrate: () => {},
  isSupported: false,
});

export function HapticProvider({ children }: { children: ReactNode }) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof navigator !== 'undefined' && 'vibrate' in navigator);
  }, []);

  const vibrate = (pattern: number | number[] = 50) => {
    if (!isSupported) return;
    if (!isFeatureEnabled('ENABLE_HAPTIC_FEEDBACK')) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Silently fail if vibration fails
    }
  };

  return (
    <HapticContext.Provider value={{ vibrate, isSupported }}>
      {children}
    </HapticContext.Provider>
  );
}

export const useHaptic = () => useContext(HapticContext);

// Preset vibration patterns
export const HAPTIC_PATTERNS = {
  LIGHT: 10,
  MEDIUM: 50,
  HEAVY: 100,
  SUCCESS: [50, 100, 50] as number[],
  ERROR: [100, 50, 100] as number[],
  WARNING: [50, 50, 50] as number[],
  DELETE: [30, 50, 30] as number[],
  COMPLETE: [20, 50, 20, 50, 100] as number[],
};
