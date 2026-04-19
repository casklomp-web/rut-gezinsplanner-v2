'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirmed = searchParams.get('confirmed') === 'true'
  const error = searchParams.get('error')
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/week')
      }
    }
    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const supabase = createClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
      return
    }

    // Success - redirect to week planner
    router.push('/week')
    router.refresh()
  }

  return (
    <>
      {confirmed && (
        <div className="bg-success-50 border border-success-200 rounded-xl p-4 mb-6 text-center">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-success font-medium">
            E-mail bevestigd!
          </p>
          <p className="text-success-700 text-sm mt-1">
            Log nu in om verder te gaan.
          </p>
        </div>
      )}

      {error === 'confirmation_failed' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-red-600 font-medium">
            Bevestiging mislukt
          </p>
          <p className="text-red-500 text-sm mt-1">
            Probeer opnieuw te registreren of neem contact op.
          </p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="jouw@email.nl"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Bezig...' : 'Inloggen'}
        </button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          Inloggen
        </h1>
        <p className="text-muted text-center mb-8">
          Welkom terug bij Rut
        </p>

        <Suspense fallback={<div className="text-center">Laden...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-center mt-6 text-muted">
          Nog geen account?{' '}
          <a href="/setup" className="text-primary hover:underline">
            Account aanmaken
          </a>
        </p>
      </div>
    </main>
  )
}