'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AnalyticsProvider, ErrorTrackingProvider } from './FeatureProvider';
import { HapticProvider } from './HapticProvider';
import { OfflineProvider } from './OfflineProvider';
import { RealtimeProvider } from './RealtimeProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorTrackingProvider>
      <QueryProvider>
        <OfflineProvider>
          <HapticProvider>
            <RealtimeProvider>
              <AnalyticsProvider>
                {children}
              </AnalyticsProvider>
            </RealtimeProvider>
          </HapticProvider>
        </OfflineProvider>
      </QueryProvider>
    </ErrorTrackingProvider>
  );
}
