# Database Migrations Workflow

## Overzicht

Dit project gebruikt een **migration-first workflow** voor alle databasewijzigingen. Dit betekent:

- Alle schema-wijzigingen gaan via migration files in `supabase/migrations/`
- Geen handmatige SQL in de Supabase editor
- Geen ad-hoc schema-wijzigingen buiten migrations om
- Volledige audit trail via Git

## Vereisten

### GitHub Secrets

De volgende secrets moeten zijn geconfigureerd in GitHub (Settings → Secrets and variables → Actions):

| Secret | Beschrijving | Waar te vinden |
|--------|--------------|----------------|
| `SUPABASE_ACCESS_TOKEN` | Personal Access Token voor Supabase CLI | Supabase Dashboard → Account → Access Tokens |
| `SUPABASE_PROJECT_ID` | Project reference ID | Supabase Dashboard → Project Settings → General → Reference ID |
| `SUPABASE_DB_PASSWORD` | Database wachtwoord | Supabase Dashboard → Project Settings → Database → Connection string |

## Workflow

### 1. Migration Voorstel

- Developer (AI of human) maakt migration file aan
- File naam: `XXX_beschrijvende_naam.sql` (sequentieel genummerd)
- Plaats in: `supabase/migrations/`

### 2. Review Process

```
migration file → commit naar feature branch → Pull Request → review → merge
```

- SQL wordt beoordeeld in GitHub PR
- Pas na akkoord wordt gemerged naar `main`

### 3. Automatische Uitvoering

Bij merge naar `main`:
1. GitHub Actions workflow triggert
2. Supabase CLI wordt geïnstalleerd
3. Project wordt gelinkt
4. `supabase db push` draait alle nieuwe migrations

### 4. Resultaat

- Succes: groen vinkje ✅ in Actions tab
- Fout: rood kruis ❌ + notificatie → fix via nieuwe PR

## Regels

### Wat WEL mag:
- ✅ Migrations via files in `supabase/migrations/`
- ✅ Review via GitHub PR
- ✅ Automatische uitvoering via GitHub Actions
- ✅ Rollback via nieuwe migration (nooit handmatig)

### Wat NIET mag:
- ❌ Handmatige SQL in Supabase editor
- ❌ Schema-wijzigingen buiten migrations om
- ❌ Migrations direct in `main` committen (altijd via PR)
- ❌ Secrets delen in chat of code

## Fallback: Als een Migration Faalt

### Scenario 1: Migration faalt in GitHub Actions
1. Check de error in GitHub Actions logs
2. Fix de migration file (of maak nieuwe fix-migration)
3. Nieuwe PR → review → merge
4. Actions draait opnieuw

### Scenario 2: Productie database is corrupt
1. **Nooit** handmatig fixen in Supabase editor
2. Maak recovery migration file
3. PR → review → merge
4. Actions voert recovery uit

### Scenario 3: Complete reset nodig (alleen voor testdata)
```bash
# Lokaal, alleen voor development:
supabase db reset
```

**Nooit** op productie zonder expliciete toestemming van alle stakeholders.

## Voorbeeld Migration File

```sql
-- 004_add_user_profiles.sql
-- Purpose: Add user profile fields for v0.2 health tracking

ALTER TABLE household_members ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE household_members ADD COLUMN IF NOT EXISTS height_cm INTEGER;
ALTER TABLE household_members ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2);
```

## Rollback Strategie

Supabase CLI ondersteunt geen automatische rollback. Als een migration foutief is:

1. Maak een **nieuwe** migration die de wijziging ongedaan maakt
2. Commit als `005_rollback_xxx.sql`
3. PR → review → merge
4. Actions draait de rollback

## Contact

Bij vragen over deze workflow: raadpleeg de project owner voordat je handmatige wijzigingen doet.
