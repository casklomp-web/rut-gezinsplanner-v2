import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/week')
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Welkom bij Rut
        </h1>
        <p className="text-muted text-lg mb-8">
          Slimme maaltijdplanning voor je gezin
        </p>
        
        <div className="space-y-4">
          <a 
            href="/setup" 
            className="block w-full bg-primary text-white py-4 px-6 rounded-xl text-center font-medium hover:bg-primary-600 transition-colors"
          >
            Nieuw huishouden starten
          </a>
          
          <a 
            href="/login" 
            className="block w-full bg-white border-2 border-primary text-primary py-4 px-6 rounded-xl text-center font-medium hover:bg-primary-50 transition-colors"
          >
            Inloggen
          </a>
        </div>
      </div>
    </main>
  )
}
