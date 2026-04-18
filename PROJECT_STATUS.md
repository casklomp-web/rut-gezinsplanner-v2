# Rut - Project Status

Laatst bijgewerkt: 2026-04-18

## Productvisie
Rut = Hybride familieplanner (Hive-achtig) × voedingsapp (Vytal-achtig)

**Uniek**: De enige app die gezinsplanning én persoonlijke health-doelen combineert. Geen losse apps meer voor agenda, recepten, calorieën en sport — maar één slim systeem.

## Doelgroep
Drukke ouders (35-45) met 2+ kinderen, werkt parttime, wil gezonder eten maar heeft geen tijd voor complexe meal-prep.

**Pijn**: "Ik wil afvallen, maar ik kan mijn gezin niet apart laten eten. En ik heb geen zin om elke avond te bedenken wat er op tafel komt."

## Huidige Status (v0.1)

### ✅ Werkt
- Auth (login/account aanmaken)
- Huishouden aanmaken
- Weekplanner (ma-zo, 3 maaltijden per dag)
- Recepten toewijzen aan dagen
- Boodschappenlijst (gegroepeerd per categorie)
- 15 recepten in database met ingrediënten
- Responsive layout (mobile + desktop)

### ⚠️ Bekende Problemen
- UI nog niet premium genoeg (design input nodig via v0.dev)
- Weekplanner grid te krap op desktop
- "Toevoegen" actie niet prominent genoeg
- Geen duidelijke visuele hiërarchie (dag > maaltijd > recept)

### 🚧 In Ontwikkeling
- Design richting bepalen via v0.dev
- Daarna: complete UI redesign implementatie

## Technisch
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel
- **Migrations**: GitHub Actions (momenteel issues met DB credentials)

## Openstaande Taken
1. v0.dev design concepten genereren (Cas)
2. Design richting kiezen (Cas)
3. UI redesign implementeren (Agent)
4. Login/setup pagina's polishen (Agent)
5. Migrations workflow fixen (later)

## Definities
- **"Klaar"** = functioneel werkt + UI ziet er professioneel uit + getest op mobile & desktop
- **"Premium"** = rustig, consistent, goede typografie, duidelijke hiërarchie
