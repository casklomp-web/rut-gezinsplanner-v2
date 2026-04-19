'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  isOffline: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  pendingChanges: number;
  triggerSync: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isOffline: false,
  syncStatus: 'idle',
  pendingChanges: 0,
  triggerSync: async () => {},
});

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = async () => {
    if (!isOnline) return;
    
    setSyncStatus('syncing');
    try {
      // Trigger background sync if available
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (registration as any).sync.register('sync-checkins');
        }
      }
      setSyncStatus('synced');
      setPendingChanges(0);
    } catch (error) {
      setSyncStatus('error');
    }
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      isOffline: !isOnline,
      syncStatus,
      pendingChanges,
      triggerSync,
    }}>
      {children}
    </OfflineContext.Provider>
  );
}

export const useOffline = () => useContext(OfflineContext);
