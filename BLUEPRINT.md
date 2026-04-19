# Rut - Blueprint & Guardrails

**Laatst bijgewerkt: 2026-04-19**

---

## Product Positionering

**Wat is Rut?**
Rut is een **Family Task Board** met geïntegreerde maaltijdplanning. 

De kern is **"schuiven met verantwoordelijkheden"** - taken visueel verdelen over gezinsleden en flexibel verschuiven.

**Niet:**
- ❌ Een kalender app
- ❌ Een todo lijst
- ❌ Een dieet app
- ❌ Een budget tool

**Wel:**
- ✅ Een visueel bord voor gezinsverantwoordelijkheden
- ✅ Met maaltijden als speciaal type taak
- ✅ Waar je letterlijk taken kunt verslepen tussen personen

---

## MVP Scope (v0.2)

### In Scope (P0)
1. **Family Task Board** - 2D lanes per gezinslid
2. **Taken systeem** - aanmaken, toewijzen, verschuiven
3. **Recurrence** - dagelijks/wekelijks
4. **Weekplanner + Food** - bestaand uit v0.1
5. **Responsive** - mobile + iPad

### Out of Scope (v0.2)
1. **3D UI** - komt in v1.0
2. **Agenda sync** - komt in v0.3
3. **Health tracking** - komt in v0.3
4. **Kostentracking** - alleen concept, geen implementatie
5. **AI features** - komt in v1.0

---

## Guardrails - Wat MAG

### Autonoom bouwen (zonder toestemming):
- ✅ UI components en pagina's
- ✅ Frontend state management
- ✅ Mock data en feature flags
- ✅ Lokale build en test
- ✅ Documentatie updaten
- ✅ Refactors binnen scope

### Met goedkeuring (melden eerst):
- ⚠️ Production deploy
- ⚠️ Database schema wijzigingen
- ⚠️ Auth flow wijzigingen
- ⚠️ Nieuwe externe API's
- ⚠️ Betaalde integraties (Stripe, etc.)

---

## Guardrails - wat MAG NIET

### Nooit zonder expliciete toestemming:
- ❌ Production database migrations
- ❌ Supabase project aanmaken/wijzigen
- ❌ Auth providers wijzigen
- ❌ Stripe of betalingen toevoegen
- ❌ Google/Apple OAuth toevoegen
- ❌ 3D libraries toevoegen (Three.js, etc.)
- ❌ Brede architectuur refactors

### Nooit in deze fase:
- ❌ 3D UI bouwen (te vroeg)
- ❌ Agenda sync (niet onderscheidend)
- ❌ Kostentracking (scope creep)
- ❌ Advanced AI (niet kern)
- ❌ Voice commands (te complex)

---

## Workflow

### Voor elke taak:
1. **INSPECT** - Wat is de huidige state?
2. **PLAN** - Wat ga ik concreet doen?
3. **IMPLEMENT** - Bouwen met kwaliteit
4. **VERIFY** - Build testen, regressie check
5. **DOCUMENT** - Update status bestanden

### Build regels:
- Max 2 pogingen per build error
- Geen retry loops
- Stop bij rate limits
- Analyseer eerst, fix dan

### Commit regels:
- Commit per logische eenheid
- Duidelijke commit messages
- Geen "WIP" commits
- Test eerst lokaal

---

## Data Model (MVP)

### Core Entities

```
households
├── id (uuid)
├── name (text)
├── created_by (uuid)
└── created_at (timestamp)

household_members
├── id (uuid)
├── household_id (uuid)
├── user_id (uuid)
├── display_name (text)
├── role (enum: admin, member)
├── color (text) - voor UI
└── created_at (timestamp)

tasks
├── id (uuid)
├── household_id (uuid)
├── created_by (uuid)
├── assignee_id (uuid)
├── title (text)
├── description (text)
├── due_date (date)
├── status (enum: todo, in_progress, done)
├── recurrence (enum: none, daily, weekly)
├── recurrence_end_date (date, null)
├── is_meal (boolean) - voor food integratie
├── meal_type (enum: breakfast, lunch, dinner, null)
└── created_at (timestamp)

task_completions
├── id (uuid)
├── task_id (uuid)
├── completed_by (uuid)
├── completed_at (timestamp)
└── week_number (int)
```

---

## Architectuur Principes

1. **Mobile-first** - Werkt op telefoon, shine op iPad
2. **Offline-ready** - Local state first, sync later
3. **Progressive enhancement** - Basis werkt zonder JS, enhanced met JS
4. **Component-based** - Herbruikbare UI components
5. **Type-safe** - TypeScript overal

---

## Design Principes

1. **Tastbaar gevoel** - Duidelijke interacties, haptic feedback
2. **Visuele hiërarchie** - Lanes > Dagen > Taken
3. **Speels maar functioneel** - Niet te serieus, wel efficiënt
4. **Familie-vriendelijk** - Kinderen moeten het snappen
5. **iPad-optimized** - Daar shine de app het meest

---

## Risico's & Mitigatie

| Risico | Impact | Mitigatie |
|--------|--------|-----------|
| Drag & drop werkt niet smooth | Hoog | Test vroeg op echte devices |
| Te complex voor MVP | Hoog | Strikte scope, 2D alleen |
| Database schema verkeerd | Medium | Mock data eerst, schema later |
| Geen product-market fit | Hoog | Snelle MVP, snelle feedback |
| Te veel features | Hoog | Guardrails, P0 focus |

---

## Succes Criteria

### Technisch:
- [ ] Build succesvol
- [ ] Geen TypeScript errors
- [ ] Responsive op mobile + iPad
- [ ] Drag & drop werkt smooth

### Functioneel:
- [ ] Gezin kan taken aanmaken
- [ ] Taken kunnen verschoven worden
- [ ] Terugkerende taken werken
- [ ] Weekplanner + food blijft werken

### UX:
- [ ] Kind kan eigen taken zien
- [ ] Ouder kan taken verschuiven in < 3 seconden
- [ ] App voelt "magisch" aan op iPad

---

## Checklist voor elke sessie

- [ ] Lees PRODUCT_VISION.md
- [ ] Lees ROADMAP.md
- [ ] Check huidige status
- [ ] Bepaal scope voor deze sessie
- [ ] Werk autonoom binnen guardrails
- [ ] Test build
- [ ] Update documentatie
- [ ] Commit met duidelijke message

---

*Dit document is de bron van waarheid voor technische en productbeslissingen.*