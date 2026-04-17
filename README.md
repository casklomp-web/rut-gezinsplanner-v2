# Rut - Gezinsplanner

Eenvoudige, autismevriendelijke gezinsplanner voor vetverlies.

## Wat is dit?

Een mobiele webapp die helpt met:
- Weekmenu's genereren (eiwitrijk, <15min bereiding)
- Boodschappenlijsten automatisch maken
- Dagelijkse check-ins (zonder schuldgevoel)
- Herinneringen via push notificaties
- Telegram integratie

## Features

### ✅ MVP (Compleet)
- **Vandaag-scherm** - Zie wat er vandaag moet gebeuren
- **Week generator** - Automatische weekplanning
- **Maaltijd-swaps** - Wissel maaltijden met 1 tap
- **Boodschappenlijst** - Per winkel, in looproute, afvinkbaar
- **Gezinsprofielen** - Cas + Partner + Kind
- **Instellingen** - Herinneringen aan/uit

### ✅ Fase 2 (Compleet)
- **Push notificaties** - Web Push API
- **Telegram integratie** - Weekoverzichten in groep
- **Week historie** - Bekijk oude weken
- **Service Worker** - Offline support

## Techniek

- Next.js 14 + TypeScript
- Tailwind CSS
- Zustand (state management)
- LocalStorage (data opslag)
- PWA (installeerbaar op telefoon)
- Web Push API

## Installatie

```bash
cd rut-app
npm install
npm run dev
```

## Deploy

```bash
npm run build
# Upload dist/ folder naar Vercel/Netlify
```

## Telegram Setup

1. Maak Telegram groep "Gezinsplanner"
2. Voeg je OpenClaw bot toe
3. Vraag Chat ID op via @userinfobot
4. Vul in bij Instellingen > Telegram

## Push Notificaties Setup

1. Open app op telefoon
2. Ga naar Instellingen > Push Notificaties
3. Tap "Schakel notificaties in"
4. Accepteer browser prompt

## Data Model

- 20+ maaltijden in database
- 40+ ingrediënten
- Automatische meal prep logica
- Kindvriendelijke varianten
- Week historie (laatste 4 weken)

## Bestanden Structuur

```
rut-app/
├── app/                    # Next.js pages
│   ├── page.tsx           # Vandaag scherm
│   ├── week/page.tsx      # Week overzicht
│   ├── shopping/page.tsx  # Boodschappen
│   ├── settings/page.tsx  # Instellingen
│   └── history/page.tsx   # Week historie
├── components/
│   ├── week/              # Week components
│   │   ├── WeekDayCard.tsx
│   │   └── MealSwapModal.tsx
│   └── ui/                # UI components
├── lib/
│   ├── data/              # Maaltijden & ingrediënten
│   ├── logic/             # Business logic
│   │   ├── weekGenerator.ts
│   │   ├── shoppingList.ts
│   │   ├── notifications.ts
│   │   └── telegram.ts
│   └── store/             # Zustand stores
└── public/
    ├── sw.js              # Service Worker
    └── manifest.json      # PWA manifest
```

## Omgevingsvariabelen (voor Telegram)

In productie, voeg toe aan `.env.local`:

```
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
```

## Roadmap

- [x] Maaltijd-swaps in UI
- [x] Push notificaties
- [x] Telegram integratie
- [x] Week historie
- [ ] Backend sync (Supabase)
- [ ] Meerdere gebruikers sync
- [ ] Voortgangsgrafieken
- [ ] Recepten toevoegen

## Licentie

Privé gebruik voor Cas & familie.
