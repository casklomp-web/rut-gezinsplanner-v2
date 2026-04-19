import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { WeekPlanner } from '@/components/week/week-planner'
import { AppShell } from '@/components/navigation/app-shell'

export const dynamic = 'force-dynamic'

export default async function WeekPage() {
  const supabase = await createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <AppShell>
      <WeekPlanner />
    </AppShell>
  )
}