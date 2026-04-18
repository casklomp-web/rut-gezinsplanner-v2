import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import WeekPlanner from './WeekPlanner'

export const dynamic = 'force-dynamic'

export default async function WeekPage() {
  const supabase = createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <WeekPlanner />
}
