// Service Worker voor Push Notificaties

const CACHE_NAME = "rut-app-v1";

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(self.clients.claim());
});

// Push event (ontvang notificaties van server)
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  
  let data = {
    title: "Rut Herinnering",
    body: "Je hebt een herinnering",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: "reminder",
    requireInteraction: false
  };
  
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.error("Error parsing push data:", e);
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Sluiten" }
      ]
    })
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  
  event.notification.close();
  
  if (event.action === "open" || !event.action) {
    event.waitUntil(
      self.clients.openWindow("/")
    );
  }
});

// Background sync (voor offline support)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-checkins") {
    console.log("Background sync: checkins");
    // Hier zouden we checkins kunnen syncen naar server
  }
});

// Fetch event (caching strategy)
self.addEventListener("fetch", (event) => {
  // Network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});
