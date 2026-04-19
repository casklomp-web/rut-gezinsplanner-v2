# Rut App - Changelog

## Versie 2.2.0 - 10 Extra Features (2025-04-19)

### 1. Social Sharing ✅
- **Native Share API** - Deel recepten via het native deel menu
- **Weekmenu delen** - Deel het weekmenu als tekst
- **Boodschappenlijst delen** - Deel de boodschappenlijst
- **Uitnodigingslinks** - Genereer uitnodigingslinks voor huishouden
- **SocialShareButtons component** - Uniforme deel interface
- **InviteLinkGenerator** - Genereer en kopieer uitnodigingslinks
- **WhatsApp, Telegram, Email** - Directe deel opties naar populaire apps

### 2. Meal Prep Mode ✅
- **Prep dag indicator** - Markeer een dag als meal prep dag
- **Batch cooking planning** - Identificeer maaltijden geschikt voor meal prep
- **Bewaartips per recept** - Automatische opslag instructies
- **Tijdsinschatting** - Bereken totale prep + kook tijd
- **StorageTipCard component** - Gedetailleerde bewaar instructies
- **PrepDayBadge** - Visuele indicator op dag kaarten

### 3. Smart Suggestions ✅
- **AI suggesties** - Slimme recept aanbevelingen op basis van voorkeuren
- **"Meer van dit"** - Vind vergelijkbare recepten
- **Seizoensgebonden** - Automatische seizoens suggesties
- **Smart search** - Fuzzy matching met gebruikersvoorkeuren
- **SmartSuggestions component** - Geïntegreerde suggestie UI
- **MoreLikeThis component** - Vergelijkbare recepten weergave

### 4. Price Tracking ✅
- **Supermarkt vergelijking** - Vergelijk prijzen tussen winkels
- **Goedkoopste suggestie** - Automatische beste winkel keuze
- **Budget overzicht** - Weekelijkse uitgaven tracking
- **Prijs historie** - Bewaar en vergelijk historische prijzen
- **Aanbiedingen** - Highlight beste deals
- **PriceComparison component** - Visuele prijsvergelijking

### 5. Nutrition Info ✅
- **Calorieën per recept** - Automatische calorie berekening
- **Macro's** - Eiwit, koolhydraten, vet weergave
- **Dagelijkse overzichten** - Totale voedingswaarden per dag
- **Weekelijkse statistieken** - Gemiddelden en trends
- **NutritionPanel component** - Compacte en volledige weergave
- **Voedingswaarden in recepten** - Directe weergave in recept lijst

### 6. Voice Input ✅
- **Spraak naar tekst** - Zoeken met je stem
- **Voice commands** - "Plan pasta voor morgen"
- **Nederlandse taal** - NL-NL ondersteuning
- **Command parsing** - Slimme commando interpretatie
- **VoiceInputButton component** - Microfoon knop met feedback
- **VoiceCommandHelp** - Overzicht van beschikbare commando's

### 7. Barcode Scanner ✅
- **Camera scanning** - Scan producten met camera
- **Handmatige invoer** - Barcode nummer invoeren
- **Auto-aanvullen** - Product details automatisch ophalen
- **Snel toevoegen** - Snelle toevoeg knoppen voor veelgebruikte items
- **Recent gescand** - Geschiedenis van gescande producten
- **BarcodeScanner component** - Volledige scanner interface

### 8. Dark Mode Toggle ✅
- **System preference** - Respecteer systeem instelling
- **Manual toggle** - Handmatig licht/donker schakelen
- **Smooth transition** - Vloeiende overgang tussen thema's
- **CSS variables** - Consistente dark mode styling
- **DarkModeToggle component** - Schakelaar in instellingen
- **useDarkMode hook** - Dark mode state management

### 9. Export/Import ✅
- **JSON backup** - Volledige data export
- **CSV export** - Weekplanning en boodschappen als spreadsheet
- **Import functionaliteit** - Herstel van backup
- **Data validatie** - Controleer backup integriteit
- **ExportImportPanel component** - Geïntegreerde export/import UI
- **Versie compatibiliteit** - Checks voor backup versies

### 10. Collaborative Editing ✅
- **Real-time sync** - Simulatie van real-time synchronisatie
- **Conflict resolution** - UI voor het oplossen van conflicten
- **Activity log** - Geschiedenis van alle wijzigingen
- **Huishouden beheer** - Leden toevoegen/verwijderen
- **Online status** - Zie wie er online is
- **CollaborativeStatus component** - Volledige samenwerking UI

---

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
