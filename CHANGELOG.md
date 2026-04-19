# Rut App - Changelog

## Versie 2.1.0 - 10 Critieke Features (2025-04-19)

### 1. PWA Setup ✅
- **manifest.json** - Volledige app informatie met icons, theme, shortcuts
- **Service Worker** - Offline support met Cache First en Network First strategieën
- **Install Prompt** - PWAInstallPrompt component voor "Add to Home Screen" functionaliteit
- **Offline Fallback** - `/offline.html` pagina voor wanneer de app offline is
- **Icons** - 192x192 en 512x512 PNG icons gegenereerd

### 2. Drag & Drop Weekplanner ✅
- **@dnd-kit/core** implementatie voor drag & drop
- **DraggableWeekPlanner** component - Recepten verslepen tussen dagen en maaltijden
- **Visuele feedback** - Highlighting tijdens drag, drag overlay met meal info
- **swapMealBetweenDays** - Store actie voor het wisselen van maaltijden
- **Fallback** - Static weergave wanneer drag & drop uitgeschakeld is

### 3. Offline Support ✅
- **Service Worker cache strategie** - Static assets, API calls, en HTML pagina's
- **Offline fallback pagina** - `/offline.html` met status indicator
- **Background sync** - Sync wanneer app weer online komt
- **OfflineProvider** - React context voor online/offline status

### 4. Analytics ✅
- **Plausible Analytics** - Privacy-vriendelijke page view tracking
- **PostHog** - Event tracking voor gebruikersacties
- **trackEvent helper** - Eenvoudige event tracking functie
- **AnalyticsEvents** - Predefined events voor meals, shopping, training, etc.
- **Events geïmplementeerd**:
  - MEAL_COMPLETED, MEAL_SWAPPED
  - WEEK_GENERATED
  - SHOPPING_LIST_GENERATED, SHOPPING_ITEM_CHECKED, SHOPPING_LIST_EXPORTED
  - TRAINING_COMPLETED
  - APP_INSTALLED

### 5. Image Optimization ✅
- **OptimizedImage component** - next/image wrapper met lazy loading
- **RecipeImage component** - Aspect ratio 16:9 voor recept afbeeldingen
- **AvatarImage component** - Ronde avatars met fallback naar initialen
- **Placeholder blur** - Smooth loading transition met blur effect
- **Error handling** - Fallback UI wanneer afbeeldingen niet laden

### 6. Mobile Bottom Sheet ✅
- **Vaul library** - Swipeable bottom sheets voor mobile
- **BottomSheet component** - Modal fallback op desktop, bottom sheet op mobile
- **Swipe to close** - Intuïtieve mobile UX
- **Handle indicator** - Visuele indicator voor swipebaar gebied

### 7. Pull to Refresh ✅
- **PullToRefresh component** - Op weekplanner en boodschappenlijst
- **Swipeable.tsx** - Geïntegreerd in bestaande swipeable component
- **Refresh indicator** - Loading spinner tijdens refresh
- **triggerSync** - OfflineProvider sync integratie

### 8. Haptic Feedback ✅
- **Vibration API** - Navigator.vibrate() integratie
- **HapticProvider** - React context voor haptic feedback
- **HAPTIC_PATTERNS** - Preset vibratie patronen (LIGHT, MEDIUM, HEAVY, SUCCESS, ERROR, etc.)
- **useHaptic hook** - Eenvoudige haptic feedback in componenten
- **Mobile only** - Alleen actief op mobile devices

### 9. Keyboard Shortcuts ✅
- **? toets** - Help overlay met alle sneltoetsen
- **Ctrl+S / Cmd+S** - Opslaan / Sync trigger
- **Esc** - Sluiten van modals (met custom event)
- **Navigation** - g+t (Today), g+w (Week), g+s (Shopping), g+r (Recipes), g+p (Profile)
- **Actions** - n+w (New Week), n+s (New Shopping List)
- **react-hotkeys-hook** - Robuuste keyboard shortcut handling

### 10. Error Logging ✅
- **Sentry integratie** - @sentry/nextjs voor error tracking
- **ErrorBoundary** - React error boundary met Sentry logging
- **Performance monitoring** - Web Vitals tracking
- **componentDidCatch** - Errors worden automatisch naar Sentry gestuurd
- **Environment based** - Alleen actief in production

---

## Versie 2.0.0 - Major Update (2025-04-19)

### Performance & Optimalisatie
1. **Image optimization** - Geïmplementeerd met OptimizedImage component voor lazy loading en smooth transitions
2. **Lazy loading** - Infinite scroll geïmplementeerd voor recepten bibliotheek met useInfiniteScroll hook
3. **Code splitting** - Dynamic imports per route geconfigureerd in next.config.js
4. **Bundle analyse** - webpack-bundle-analyzer toegevoegd met `npm run analyze`
5. **Caching strategie** - React Query geïmplementeerd met QueryProvider voor server state management

### Mobile & Responsive
6. **Mobile-first responsive fixes** - Alle pagina's geoptimaliseerd voor mobile met verbeterde touch targets
7. **Touch gestures** - Swipe om te verwijderen/afvinken, pull-to-refresh met react-swipeable
8. **PWA setup** - Verbeterde manifest.json met shortcuts, geoptimaliseerde service worker
9. **Mobile bottom sheet** - Vaul library geïntegreerd voor bottom sheets op mobile

### Data & Sync
10. **Offline support** - Verbeterde service worker met Cache First en Network First strategieën
11. **Real-time sync** - Supabase realtime subscriptions met RealtimeProvider
12. **Conflict resolution** - Multi-device sync met server-wins strategie
13. **Data export** - PDF generatie voor shopping list met jsPDF en jspdf-autotable

### UX & Interactie
14. **Drag & drop** - Weekplanner herschikken met @dnd-kit/core en @dnd-kit/sortable
15. **Swipe to complete** - Shopping list items swipen om af te vinken
16. **Haptic feedback** - Vibration API integratie met useHaptic hook
17. **Keyboard shortcuts** - Sneltoetsen voor power users met react-hotkeys-hook

### Testing & Kwaliteit
18. **E2E tests** - Playwright tests voor kritieke flows
19. **Unit tests** - Jest tests voor utilities en hooks
20. **Accessibility** - A11y audit en fixes (ARIA labels, focus management, reduced motion)

### Extra Features
21. **Analytics** - PostHog integratie voor usage tracking
22. **Error logging** - Sentry integratie voor error tracking
23. **Feature flags** - Feature flags systeem voor A/B testing

### Technische Verbeteringen
- Verbeterde TypeScript types
- Betere error handling met ErrorBoundary
- Toast notificaties systeem
- Skeleton loading states
- Page transitions met Framer Motion
- Verbeterde state management met Zustand

### Dependencies Toegevoegd
- @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- @sentry/nextjs
- @tanstack/react-query, @tanstack/react-query-devtools
- @use-gesture/react
- jspdf, jspdf-autotable
- posthog-js
- react-hotkeys-hook
- react-intersection-observer
- react-swipeable
- vaul
- sonner
- framer-motion (voor animations)

### Dev Dependencies Toegevoegd
- @playwright/test
- @testing-library/jest-dom, @testing-library/react
- @types/jest
- cross-env
- jest, jest-environment-jsdom
- ts-jest
- webpack-bundle-analyzer
