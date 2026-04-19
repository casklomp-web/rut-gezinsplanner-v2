import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { RecipeLibrary } from '@/components/recipes/recipe-library'
import { AppShell } from '@/components/navigation/app-shell'

export const dynamic = 'force-dynamic'

export default async function ReceptenPage() {
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <AppShell>
      <RecipeLibrary />
    </AppShell>
  )
}