'use client';

import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useWeekStore } from '@/lib/store/weekStore';
import { useUserStore } from '@/lib/store/userStore';
import { isFeatureEnabled } from './FeatureProvider';
import { toast } from '@/components/ui/Toast';

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const { currentWeek, setCurrentWeek } = useWeekStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    if (!isFeatureEnabled('ENABLE_REALTIME_SYNC')) return;
    if (!currentUser?.id) return;

    // Subscribe to week changes
    const weekChannel = supabase
      .channel('week-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'weeks',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          console.log('Week change received:', payload);
          
          if (payload.eventType === 'UPDATE' && currentWeek?.id === payload.new.id && currentWeek) {
            // Merge remote changes with local state
            // Conflict resolution: server wins for most fields
            const updatedWeek: typeof currentWeek = {
              ...currentWeek,
              ...payload.new as Partial<typeof currentWeek>,
              // Keep local checkins if they're newer
              days: currentWeek.days.map((day, index) => {
                const remoteDay = payload.new.days?.[index];
                if (!remoteDay) return day;
                
                return {
                  ...day,
                  ...remoteDay,
                  checkins: {
                    ...day.checkins,
                    ...remoteDay.checkins,
                  },
                };
              }),
            };
            
            setCurrentWeek(updatedWeek);
            toast.info('Week bijgewerkt vanaf andere device');
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('Realtime subscription status:', status);
      });

    // Subscribe to shopping list changes
    const shoppingChannel = supabase
      .channel('shopping-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_lists',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          console.log('Shopping list change received:', payload);
        }
      )
      .subscribe();

    return () => {
      weekChannel.unsubscribe();
      shoppingChannel.unsubscribe();
    };
  }, [currentUser?.id, currentWeek?.id, setCurrentWeek]);

  return <>{children}</>;
}
