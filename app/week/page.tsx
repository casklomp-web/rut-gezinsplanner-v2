import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function WeekPage() {
  const supabase = createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Weekplanner
        </h1>
        <p className="text-muted mb-8">
          Weekplanner volgt in de volgende stap
        </p>
        
        <div className="p-6 bg-white rounded-xl border border-border">
          <p className="text-foreground">
            ✅ Auth werkt! Je bent ingelogd als:
          </p>
          <p className="text-primary font-medium mt-2">
            {user.email}
          </p>
        </div>

        <form action="/auth/signout" method="post" className="mt-8">
          <button
            type="submit"
            className="text-muted hover:text-foreground transition-colors"
          >
            Uitloggen
          </button>
        </form>
      </div>
    </main>
  )
}
