# Rut - UI Notes & Design Decisions

## Huidige Problemen (worden opgelost via v0.dev)

### Weekplanner
- Voelt als "ruwe lijst" niet als "doordachte planner"
- 7-koloms grid is te krap; receptnamen worden afgekapt
- "Toevoegen" actie is een klein "+" dat niet uitnodigt tot klikken
- Geen visueel onderscheid tussen dagen (alle kaarten zien er hetzelfde uit)
- Geen "vandaag" indicator
- Maaltijd labels (Ontbijt/Lunch/Diner) zijn klein en grijs

### Boodschappenlijst
- Niet rustig/premium genoeg
- Items zien er uit als standaard HTML lijst
- Checkbox + tekst + hoeveelheid staan te dicht
- Categorie headers zijn niet prominent genoeg
- Hoeveelheden zijn niet goed uitgelijnd

### Algemeen
- Spacing inconsistent tussen elementen
- String formatting bugs (spaties ontbreken)
- Geen duidelijke visuele hiërarchie
- Browser-default styling op sommige elementen

## Design Principes (voor implementatie)

### Stijl
- **Rustig**: veel witruimte, niet druk
- **Professioneel**: consistent, nette afwerking
- **Premium**: subtiele details, goede typografie
- **Dutch design**: organized, minimal, trustworthy

### Kleuren
- **Primary**: `#2563eb` (blue-600) - acties, tabs, badges
- **Background**: `#f8fafc` (slate-50) - pagina achtergrond
- **Surface**: `#ffffff` (wit) - kaarten, modals
- **Border**: `#e2e8f0` (slate-200) - subtiele scheidingen
- **Text Primary**: `#0f172a` (slate-900) - hoofdtekst
- **Text Secondary**: `#64748b` (slate-500) - subtiele tekst

### Typography
- **Headers**: `font-semibold`, consistente sizes
- **Body**: `text-slate-900`, `leading-relaxed`
- **Labels**: `text-slate-500`, `text-sm`, `uppercase tracking-wide`

### Spacing Scale
- **xs**: 4px (icon margins)
- **sm**: 8px (tight spacing)
- **md**: 16px (kaart padding, sectie margins)
- **lg**: 24px (tussen secties)
- **xl**: 32px (pagina padding)

### Componenten

#### Cards
- `bg-white rounded-xl border border-slate-200 shadow-sm`
- Hover: `hover:border-slate-300 hover:shadow-md`
- Padding: 16px (md)

#### Buttons
- Primary: `bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700`
- Ghost: `bg-white border border-slate-200 hover:border-slate-300`
- Icon: 40x40px, duidelijke hover state

#### Tabs
- Container: `bg-slate-100 p-1 rounded-xl`
- Active: `bg-white shadow-sm text-slate-900`
- Inactive: `text-slate-600 hover:text-slate-900`

#### Checkbox Rows
- Container: `flex items-center gap-4 p-4 rounded-xl border border-slate-200`
- Checkbox: `w-5 h-5 rounded border-slate-300 text-blue-600`
- Label: `flex-1 font-medium text-slate-700`
- Meta: `text-slate-500 text-sm bg-slate-100 px-2 py-1 rounded`

## Workflow voor Design Wijzigingen

1. **Genereer concept** in v0.dev (door Cas)
2. **Screenshot** + stuur naar Cas
3. **Cas kiest** richting
4. **Ik implementeer** exact zoals design
5. **Update** dit bestand met nieuwe richtlijnen

## Technische Constraints
- Mobile-first, maar desktop moet ook goed werken
- Tailwind CSS gebruiken
- Geen externe UI libraries (shadcn etc.) voor nu
- React + TypeScript + Next.js

## Gekozen Design Richting (2026-04-18)

### Weekplanner
- **Basis**: Concept B (prominente "Add" knoppen)
- **Layout**: 7-koloms grid op desktop, gestapeld op mobile
- **Kleuren**: Subtiele tinten per maaltijd (niet te fel)
- **Acties**: Duidelijke "+" knoppen met "Voeg toe" tekst op mobile
- **Week navigatie**: Week nummer + datumbereik

### Boodschappenlijst
- **Basis**: Huidige design (screenshot 1)
- **Categorieën**: Met icons en kleuren (Produce, Meat, Dairy, Grains)
- **Items**: Checkbox + naam + hoeveelheid badge
- **Mobile**: Goede schaling, zelfde layout

### Referentie Screenshots
- Zie: screenshots 1, 3, 4, 5, 7 in project folder

## Openstaand
- [x] v0.dev output ontvangen
- [x] Design richting gekozen
- [ ] Complete redesign implementeren (IN PROGRESS)
- [ ] Login/setup pagina's polishen

## Notities
- Datum: 2026-04-18
- Volgende actie: Cas genereert designs in v0.dev
