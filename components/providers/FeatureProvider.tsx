'use client';

import { useEffect, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Feature flags configuratie
export const FEATURE_FLAGS = {
  ENABLE_REALTIME_SYNC: process.env.NEXT_PUBLIC_ENABLE_REALTIME_SYNC === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true',
  ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE !== 'false',
  ENABLE_SWIPE_GESTURES: process.env.NEXT_PUBLIC_ENABLE_SWIPE_GESTURES !== 'false',
  ENABLE_HAPTIC_FEEDBACK: process.env.NEXT_PUBLIC_ENABLE_HAPTIC_FEEDBACK !== 'false',
  ENABLE_KEYBOARD_SHORTCUTS: process.env.NEXT_PUBLIC_ENABLE_KEYBOARD_SHORTCUTS !== 'false',
  ENABLE_DRAG_DROP: process.env.NEXT_PUBLIC_ENABLE_DRAG_DROP !== 'false',
  ENABLE_BOTTOM_SHEETS: process.env.NEXT_PUBLIC_ENABLE_BOTTOM_SHEETS !== 'false',
  ENABLE_PDF_EXPORT: process.env.NEXT_PUBLIC_ENABLE_PDF_EXPORT !== 'false',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}

// Inner Analytics Provider that uses useSearchParams
function AnalyticsProviderInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!FEATURE_FLAGS.ENABLE_ANALYTICS) return;

    // Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview');
    }

    // PostHog
    if (typeof window !== 'undefined') {
      import('posthog-js').then((posthog) => {
        posthog.default.capture('$pageview', {
          pathname,
          searchParams: searchParams.toString(),
        });
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}

// Analytics Provider with Suspense wrapper
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={children}>
      <AnalyticsProviderInner>{children}</AnalyticsProviderInner>
    </Suspense>
  );
}

// Sentry Error Boundary wrapper
export function ErrorTrackingProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!FEATURE_FLAGS.ENABLE_SENTRY) return;

    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    });
  }, []);

  return <>{children}</>;
}

// Analytics event tracking helper
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!FEATURE_FLAGS.ENABLE_ANALYTICS) return;

  // Plausible Analytics
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props: properties });
  }

  // PostHog
  if (typeof window !== 'undefined') {
    import('posthog-js').then((posthog) => {
      posthog.default.capture(eventName, properties);
    });
  }
}

// Predefined analytics events
export const AnalyticsEvents = {
  // Meal/Recipe events
  MEAL_ASSIGNED: 'meal_assigned',
  MEAL_COMPLETED: 'meal_completed',
  MEAL_SWAPPED: 'meal_swapped',
  
  // Week events
  WEEK_GENERATED: 'week_generated',
  WEEK_VIEWED: 'week_viewed',
  
  // Shopping events
  SHOPPING_LIST_GENERATED: 'shopping_list_generated',
  SHOPPING_ITEM_CHECKED: 'shopping_item_checked',
  SHOPPING_LIST_EXPORTED: 'shopping_list_exported',
  
  // Training events
  TRAINING_COMPLETED: 'training_completed',
  
  // App events
  APP_INSTALLED: 'app_installed',
  OFFLINE_MODE_USED: 'offline_mode_used',
  SYNC_TRIGGERED: 'sync_triggered',
  
  // Navigation events
  PAGE_VIEWED: 'page_viewed',
  TAB_CHANGED: 'tab_changed',
} as const;
