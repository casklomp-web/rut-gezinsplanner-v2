# Rut App - Gezinsplanner

Eenvoudige gezinsplanner voor vetverlies - Autismevriendelijk

## Features

- **Weekplanner**: Genereer automatisch weekmenu's op basis van je doelen
- **Boodschappenlijst**: Automatisch gegenereerd per winkel, met PDF export
- **Recepten bibliotheek**: Beheer je favoriete recepten met infinite scroll
- **Check-ins**: Houd je voortgang bij met dagelijkse check-ins
- **Offline ondersteuning**: Werkt ook zonder internet
- **PWA**: Installeer als app op je telefoon

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- React Query (server state)
- Supabase (backend)
- Playwright (E2E testing)
- Jest (unit testing)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run test:e2e

# Analyze bundle
npm run analyze
```

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SENTRY=true
NEXT_PUBLIC_ENABLE_REALTIME_SYNC=true
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
NEXT_PUBLIC_ENABLE_SWIPE_GESTURES=true
NEXT_PUBLIC_ENABLE_HAPTIC_FEEDBACK=true
NEXT_PUBLIC_ENABLE_KEYBOARD_SHORTCUTS=true
NEXT_PUBLIC_ENABLE_DRAG_DROP=true
NEXT_PUBLIC_ENABLE_BOTTOM_SHEETS=true
NEXT_PUBLIC_ENABLE_PDF_EXPORT=true
```

## Keyboard Shortcuts

- `g + t` - Ga naar Vandaag
- `g + w` - Ga naar Week
- `g + s` - Ga naar Boodschappen
- `g + r` - Ga naar Recepten
- `g + p` - Ga naar Profiel
- `n + w` - Nieuwe week genereren
- `n + s` - Nieuwe boodschappenlijst
- `?` - Toon sneltoetsen
- `esc` - Sluit modal

## Changelog

Zie [CHANGELOG.md](./CHANGELOG.md) voor alle wijzigingen.
