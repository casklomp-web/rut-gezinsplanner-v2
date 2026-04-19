import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ShoppingList } from '@/components/shopping/shopping-list'
import { AppShell } from '@/components/navigation/app-shell'

export const dynamic = 'force-dynamic'

export default async function BoodschappenPage() {
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <AppShell>
      <ShoppingList />
    </AppShell>
  )
}