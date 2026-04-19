import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ProfileView } from '@/components/profile/profile-view'
import { AppShell } from '@/components/navigation/app-shell'

export const dynamic = 'force-dynamic'

export default async function ProfielPage() {
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <AppShell>
      <ProfileView />
    </AppShell>
  )
}