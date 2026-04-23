'use client';

import { toast } from '@/components/ui/Toast';

export function showNotification(title: string, body: string) {
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
    });
  }
  
  // In-app toast
  toast.success(`${title}: ${body}`);
}

export function scheduleNotification(title: string, body: string, delayMs: number) {
  setTimeout(() => {
    showNotification(title, body);
  }, delayMs);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}
