# Rut - Roadmap

## v0.1 - Slimme Weekplanner (HUIDIG)
**Doel**: Basis werkt, voelt professioneel aan

**Must-have**:
- [x] Weekplanner met ma-zo overzicht
- [x] Recepten toewijzen aan dagen (ontbijt/lunch/diner)
- [x] Boodschappenlijst genereren uit geplande maaltijden
- [x] Boodschappen gegroepeerd per categorie
- [x] 15+ recepten in database met ingrediënten
- [x] Responsive layout (mobile + desktop)
- [ ] Premium UI design (IN PROGRESS - wacht op v0.dev input van Cas)

**Nice-to-have (v0.1)**:
- [ ] Recept favorieten markeren
- [ ] Snelle filters (< 20 min, vegetarisch)
- [ ] "Focus van de week" keuze

## v0.2 - Health Planner
**Doel**: Persoonlijke profielen + kcal tracking

**Features**:
- Gezinsleden profielen (leeftijd, gewicht, lengte, doel)
- Automatische kcal-berekening per persoon (Harris-Benedict)
- Per maaltijd: totale kcal + macro's voor het gezin
- "Vandaag nog X kcal over" indicator per persoon
- Slimme suggesties: "Dit recept past bij jouw doel"

## v1.0 - Gezins Coach
**Doel**: Integratie + coaching

**Features**:
- Agenda-integratie (sport, afspraken)
- Weekplanning reageert op drukke dagen (snelle maaltijden)
- Weekelijkse voortgangsrapporten per gezinslid
- Coaching-achtige features: "Goed bezig! Deze week 3x sport gepland"
- Challenges: "Familie challenge: 5 dagen gezond eten"

## Regels & Afspraken
1. **NOOIT** v0.2 starten voordat v0.1 UI echt goed is
2. **ALTIJD** design input vragen voor UI wijzigingen (v0.dev)
3. Migrations alleen via afgesproken workflow (niet handmatig in production)
4. Documenteer belangrijke beslissingen in PROJECT_STATUS.md
5. "Klaar" = functioneel + professionele UI + getest

## Onderscheidende Waarde
| App | Wat ze doen | Wat ze missen |
|-----|-------------|---------------|
| **Hive** | Familie-agenda, taken | Geen voeding, geen maaltijdplanning |
| **Vytal** | Calorie-tracking, macro's | Alleen individueel, geen gezinscontext |
| **HelloFresh** | Recepten + boodschappen | Geen planning, geen persoonlijke doelen |
| **Rut** | **Weekplanning + voeding + gezinscontext** | **De sweet spot** |
