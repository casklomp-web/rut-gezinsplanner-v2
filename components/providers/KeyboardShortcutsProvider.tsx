'use client';

import { useEffect, ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter, usePathname } from 'next/navigation';
import { isFeatureEnabled } from '@/components/providers/FeatureProvider';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';
import { toast } from '@/components/ui/Toast';

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
  onGenerateWeek?: () => void;
  onGenerateShoppingList?: () => void;
  onToggleTheme?: () => void;
}

export function KeyboardShortcutsProvider({
  children,
  onGenerateWeek,
  onGenerateShoppingList,
}: KeyboardShortcutsProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { vibrate } = useHaptic();

  useEffect(() => {
    if (!isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS')) return;
  }, []);

  // Navigation shortcuts
  useHotkeys('g+t', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.LIGHT);
    router.push('/');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  useHotkeys('g+w', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.LIGHT);
    router.push('/week');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  useHotkeys('g+s', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.LIGHT);
    router.push('/shopping');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  useHotkeys('g+r', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.LIGHT);
    router.push('/recipes');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  useHotkeys('g+p', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.LIGHT);
    router.push('/profile');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  // Action shortcuts
  useHotkeys('n+w', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    onGenerateWeek?.();
    toast.success('Nieuwe week gegenereerd');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') && !!onGenerateWeek });

  useHotkeys('n+s', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    onGenerateShoppingList?.();
    toast.success('Boodschappenlijst gegenereerd');
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') && !!onGenerateShoppingList });

  // Help shortcut
  useHotkeys('?', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.LIGHT);
    toast.info(
      '⌨️ Sneltoetsen:\n' +
      'g+t = Vandaag\n' +
      'g+w = Week\n' +
      'g+s = Boodschappen\n' +
      'g+r = Recepten\n' +
      'g+p = Profiel\n' +
      'n+w = Nieuwe week\n' +
      'n+s = Nieuwe boodschappenlijst\n' +
      '? = Help',
      { duration: 8000 }
    );
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  // Escape to close modals
  useHotkeys('esc', () => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    // Close any open modals by dispatching a custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('close-modals'));
    }
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  // Ctrl+S to save/sync
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    vibrate(HAPTIC_PATTERNS.SUCCESS);
    toast.success('Wijzigingen opgeslagen');
    // Trigger sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-sync'));
    }
  }, { enabled: isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') });

  return <>{children}</>;
}

// Hook to get keyboard shortcuts help text
export function useKeyboardShortcutsHelp() {
  const shortcuts = [
    { key: 'g + t', description: 'Ga naar Vandaag' },
    { key: 'g + w', description: 'Ga naar Week' },
    { key: 'g + s', description: 'Ga naar Boodschappen' },
    { key: 'g + r', description: 'Ga naar Recepten' },
    { key: 'g + p', description: 'Ga naar Profiel' },
    { key: 'n + w', description: 'Nieuwe week genereren' },
    { key: 'n + s', description: 'Nieuwe boodschappenlijst' },
    { key: 'ctrl + s', description: 'Opslaan / Sync' },
    { key: '?', description: 'Toon sneltoetsen' },
    { key: 'esc', description: 'Sluit modal' },
  ];

  return { shortcuts };
}
