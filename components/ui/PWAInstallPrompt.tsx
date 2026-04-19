'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { trackEvent, AnalyticsEvents } from '@/components/providers/FeatureProvider';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSince = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSince < 7) return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsVisible(false);
      trackEvent(AnalyticsEvents.APP_INSTALLED);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      trackEvent(AnalyticsEvents.APP_INSTALLED);
    }
    
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-[#4A90A4] rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">R</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#2D3436]">Installeer Rut</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Voeg toe aan je startscherm voor snelle toegang, ook offline.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Sluiten"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleDismiss}
        >
          Nu niet
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleInstall}
        >
          <Download className="w-4 h-4 mr-1.5" />
          Installeren
        </Button>
      </div>
    </div>
  );
}