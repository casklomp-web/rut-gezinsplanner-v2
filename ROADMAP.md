# Rut - Roadmap & Prioriteiten

**Laatst bijgewerkt: 2026-04-19**

---

## Prioriteit Legenda

- **P0** = Must-have voor MVP. Zonder dit werkt het product niet.
- **P1** = Should-have. Belangrijk voor goede UX, maar MVP kan zonder.
- **P2** = Nice-to-have. Komt pas na MVP lancering.

---

## v0.2 - Family Task Board MVP (HUIDIGE FOCUS)

**Doel:** Onderscheidende MVP die "schuiven met taken" demonstreert

### P0 - Must Have

| Feature | User Story | Status |
|---------|------------|--------|
| **Family Task Board UI** | Als ouder wil ik een visueel bord zien met alle taken per gezinslid | 🚧 In ontwikkeling |
| **Taken aanmaken** | Als ouder wil ik taken aanmaken zoals "afval buiten" of "keuken opruimen" | 🚧 In ontwikkeling |
| **Taken toewijzen** | Als ouder wil ik taken toewijzen aan specifieke gezinsleden | 🚧 In ontwikkeling |
| **Drag & drop verplaatsen** | Als ouder wil ik taken verslepen naar andere dagen of gezinsleden | 🚧 In ontwikkeling |
| **Terugkerende taken** | Als ouder wil ik taken instellen als dagelijks/wekelijks zodat ze automatisch terugkomen | 🚧 In ontwikkeling |
| **Weekplanner + Food** | Als gezin wil ik maaltijden plannen en de boodschappenlijst automatisch genereren | ✅ Bestaand uit v0.1 |
| **Responsive design** | Als gebruiker wil ik Rut gebruiken op zowel telefoon als iPad | ✅ Bestaand |

### P1 - Should Have (Post-MVP)

| Feature | User Story | Status |
|---------|------------|--------|
| **Taak templates** | Als ouder wil ik templates gebruiken zoals "Ochtendroutine" of "Weekend schoonmaak" | ❌ Niet gestart |
| **Taak geschiedenis** | Als ouder wil ik zien wie welke taken wanneer heeft gedaan | ❌ Niet gestart |
| **Swap voorstellen** | Als ouder wil ik een taak "swappen" met iemand anders met hun toestemming | ❌ Niet gestart |
| **Notificaties** | Als gezinslid wil ik herinneringen krijgen voor mijn taken | ❌ Niet gestart |
| **Zoeken & filteren** | Als ouder wil ik taken zoeken op naam, persoon, of datum | ❌ Niet gestart |

### P2 - Nice to Have (Later)

| Feature | User Story | Status |
|---------|------------|--------|
| **3D UI op iPad** | Als gebruiker wil ik een speels 3D bord met cubes/tiles voor taken | ❌ Niet gestart |
| **Google/Apple agenda sync** | Als gebruiker wil ik Rut koppelen aan mijn bestaande agenda | ❌ Niet gestart |
| **Voice commands** | Als gebruiker wil ik taken toevoegen via spraak | ❌ Niet gestart |
| **AI suggesties** | Als ouder wil ik dat Rut taken voorstelt op basis van onze patronen | ❌ Niet gestart |
| **Kostentracking** | Als ouder wil ik simpele kosten noteren per taak (niet als volledig budgetproduct) | ❌ Concept alleen |

---

## v0.3 - Insights & Health (NA MVP)

**Doel:** Gezinnen inzicht geven in hun taakverdeling

### P1 Features

| Feature | User Story |
|---------|------------|
| **Tijdsbesteding dashboard** | Als ouder wil ik zien hoeveel tijd elk gezinslid besteedt aan taken |
| **Eerlijke verdeling meting** | Als ouder wil ik een "eerlijkheidsmeter" zien voor taakverdeling |
| **Trends & patronen** | Als ouder wil ik zien welke dagen het drukst zijn |

### P2 Features

| Feature | User Story |
|---------|------------|
| **Health tracking** | Als gebruiker wil ik calorieën en macro's tracken per maaltijd |
| **Persoonlijke doelen** | Als gebruiker wil ik persoonlijke health doelen instellen |

---

## v1.0 - Smart Family Assistant (TOEKOMST)

**Doel:** Rut wordt een proactieve assistant

### P2 Features

| Feature | User Story |
|---------|------------|
| **Proactieve suggesties** | Als ouder wil ik dat Rut taken voorstelt op basis van onze historie |
| **Automatische verdeling** | Als ouder wil ik dat Rut taken automatisch eerlijk verdeelt |
| **Voice-first interface** | Als gebruiker wil ik Rut volledig bedienen via spraak |
| **3D immersive UI** | Als gebruiker wil ik een volledig 3D bord op iPad |

---

## Technische Roadmap

### Database (P0)
- [ ] `tasks` tabel met recurrence support
- [ ] `household_members` tabel
- [ ] `task_assignments` tabel
- [ ] `task_templates` tabel (voor later)

### API (P0)
- [ ] CRUD endpoints voor taken
- [ ] Recurrence logiek (dagelijks/wekelijks)
- [ ] Drag & drop sync

### Frontend (P0)
- [ ] Family Task Board component
- [ ] Drag & drop met @dnd-kit
- [ ] Responsive lanes layout
- [ ] Mock data → Supabase integratie

### Integraties (P1/P2)
- [ ] Google Calendar (P1)
- [ ] Apple Calendar (P2)
- [ ] Push notificaties (P1)

---

## Release Criteria

### v0.2 MVP is "klaar" als:
1. ✅ Family Task Board werkt op mobile én iPad
2. ✅ Gezin kan taken aanmaken, toewijzen, verschuiven
3. ✅ Terugkerende taken werken automatisch
4. ✅ Weekplanner + food blijft werken
5. ✅ Build is succesvol en gedeployed
6. ✅ Geen kritieke bugs

### v0.2 MVP is NIET "klaar" als:
- ❌ Alleen mock data (moet echt opslaan)
- ❌ Drag & drop is buggy
- ❌ Werkt niet op mobile
- ❌ Geen terugkerende taken

---

## Huidige Focus

**Wat we NU bouwen:**
1. Family Task Board UI (lanes, kaarten, drag & drop)
2. Taken CRUD (aanmaken, bewerken, verwijderen)
3. Recurrence (dagelijks/wekelijks)
4. Database schema voor taken

**Wat we expres NIET nu doen:**
- Geen 3D UI (te vroeg)
- Geen agenda sync (niet onderscheidend)
- Geen health tracking (scope creep)
- Geen kostentracking (niet kern)

---

*Roadmap wordt wekelijks bijgewerkt na stand-up.*