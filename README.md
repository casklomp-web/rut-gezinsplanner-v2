# Rut Gezinsplanner

Een slimme weekplanner voor gezinnen, met focus op gezonde voeding en makkelijke planning.

## Quick Links

- [Database Migrations Workflow](./docs/migrations.md) - **Lees dit voor databasewijzigingen**
- [Product Roadmap](./docs/roadmap.md) - Visie en planning

---

# Setup Instructies

## Stap 1: Supabase Project Aanmaken

1. Ga naar https://supabase.com
2. Klik "New Project"
3. Kies een organisatie (of maak nieuw)
4. Vul in:
   - **Name**: `rut-v01`
   - **Database Password**: (genereer sterke wachtwoord, bewaar veilig!)
   - **Region**: Kies dichtstbij (bijv. `West Europe`)
5. Klik "Create new project"
6. Wacht tot project klaar is (~2 minuten)

## Stap 2: Database Schema

1. In Supabase dashboard, ga naar "SQL Editor" (linker menu)
2. Klik "New query"
3. Kopieer de inhoud van `supabase/migrations/001_initial_schema.sql`
4. Plak in SQL Editor
5. Klik "Run"
6. Controleer: tabellen zijn aangemaakt in "Table Editor"

## Stap 3: Environment Variables

1. In Supabase dashboard, ga naar "Project Settings" → "API"
2. Kopieer:
   - **URL** (bijv. `https://xxxxx.supabase.co`)
   - **anon public** key (bijv. `eyJhbG...`)

3. Maak bestand `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jouw-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=jouw-anon-key-hier
```

## Stap 4: Vercel Deploy

1. Ga naar https://vercel.com
2. Klik "Add New Project"
3. Importeer van GitHub: `rut-gezinsplanner-v2`
4. Vul in:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
5. Klik "Environment Variables"
6. Voeg toe:
   - `NEXT_PUBLIC_SUPABASE_URL` = jouw Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = jouw anon key
7. Klik "Deploy"
8. Wacht tot deploy klaar is (~2 minuten)

## Stap 5: Test

1. Open de Vercel URL
2. Je zou de Next.js starter pagina moeten zien
3. Check of er geen errors zijn in console

## Volgende Stap

Ga naar **Stap 2** in het bouwplan: Database Schema toepassen (al gedaan in stap 1 hierboven) → **Stap 3**: Auth + Huishouden Setup

## Troubleshooting

**Error: "Failed to fetch"**
- Check of `.env.local` correct is
- Check of Supabase URL en key kloppen

**Error: "relation does not exist"**
- Zie [docs/migrations.md](./docs/migrations.md) voor correcte workflow
- Geen handmatige SQL in editor!

**Vercel build error**
- Check of alle environment variables zijn ingesteld
- Check build logs in Vercel dashboard

---

## Development Workflow

### Database Wijzigingen

**Belangrijk:** Alle databasewijzigingen gaan via migrations. Zie [docs/migrations.md](./docs/migrations.md) voor details.

Korte versie:
1. Migration file in `supabase/migrations/`
2. Pull Request → review
3. Merge → GitHub Actions draait automatisch
