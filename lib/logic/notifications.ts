/**
 * Push Notification Service
 * Web Push API voor herinneringen
 */

import { User, ReminderMessage } from "@/lib/types";

// VAPID keys (in productie: server-side)
const VAPID_PUBLIC_KEY = "BEl62iSMfAf8L7Bq6v7p5K8Y9Z0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6";

// Check of push notificaties worden ondersteund
export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window;
}

// Vraag toestemming voor notificaties
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    throw new Error("Notificaties niet ondersteund");
  }
  
  const permission = await Notification.requestPermission();
  return permission;
}

// Registreer service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker geregistreerd:", registration);
    return registration;
  } catch (error) {
    console.error("Service Worker registratie mislukt:", error);
    return null;
  }
}

// Subscribe voor push notificaties
export async function subscribeToPush(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    
    console.log("Push subscription:", subscription);
    return subscription;
  } catch (error) {
    console.error("Push subscription mislukt:", error);
    return null;
  }
}

// Helper: converteer base64 naar Uint8Array
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray.buffer;
}

// Stuur lokale notificatie (voor demo/testing)
export function sendLocalNotification(title: string, body: string, tag?: string): void {
  if (Notification.permission !== "granted") {
    console.warn("Notificatie toestemming niet gegeven");
    return;
  }
  
  new Notification(title, {
    body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag,
    requireInteraction: false
  });
}

// Schedule herinneringen voor vandaag
export function scheduleDailyReminders(user: User): void {
  if (Notification.permission !== "granted") return;
  
  const now = new Date();
  const reminders = user.notifications.reminders;
  
  // Ontbijt
  if (reminders.breakfast.enabled) {
    scheduleReminder(reminders.breakfast.time, "🌅 Ontbijt", "Tijd voor je ontbijt!", "breakfast");
  }
  
  // Lunch
  if (reminders.lunch.enabled) {
    scheduleReminder(reminders.lunch.time, "🥗 Lunch", "Tijd voor je lunch!", "lunch");
  }
  
  // Diner prep
  if (reminders.dinnerPrep.enabled) {
    scheduleReminder(reminders.dinnerPrep.time, "🍽️ Diner", "Begin met het voorbereiden van het diner", "dinner");
  }
  
  // Training
  if (reminders.training.enabled && user.schedule.trainingDays.length > 0) {
    scheduleReminder(reminders.training.time, "🏋️ Training", "Training staat op de planning!", "training");
  }
  
  // Medicatie
  if (reminders.medication.enabled) {
    scheduleReminder(reminders.medication.time, "💊 Medicatie", "Vergeet je medicatie niet", "medication");
  }
}

// Helper: schedule een enkele herinnering
function scheduleReminder(timeStr: string, title: string, body: string, tag: string): void {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);
  
  // Als tijd al voorbij is, plan voor morgen
  if (reminderTime < now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }
  
  const delay = reminderTime.getTime() - now.getTime();
  
  setTimeout(() => {
    sendLocalNotification(title, body, tag);
  }, delay);
  
  console.log(`Herinnering gepland: ${title} om ${timeStr} (over ${Math.round(delay / 1000 / 60)} minuten)`);
}

// Test notificatie
export function testNotification(): void {
  sendLocalNotification(
    "🎉 Rut Test",
    "Je notificaties werken! Je krijgt nu herinneringen voor maaltijden en training.",
    "test"
  );
}
