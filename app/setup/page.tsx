'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

interface MemberForm {
  name: string
  role: 'admin' | 'member'
}

export default function SetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const confirmed = searchParams.get('confirmed') === 'true'
  
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  
  // Step 1: Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Step 2: Household
  const [householdName, setHouseholdName] = useState('')
  
  // Step 3: Members
  const [members, setMembers] = useState<MemberForm[]>([
    { name: '', role: 'admin' }
  ])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check auth on mount - allow new users to create account
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        setUser(currentUser)
        setStep(2) // Skip to step 2 if logged in
      }
      // If not logged in, stay on step 1 to create account
      setLoadingUser(false)
    }
    checkUser()
  }, [router])

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      setUser(data.user)
      // Check if email confirmation is required
      if (data.session) {
        // Auto-confirmed (email confirmation disabled in Supabase) - go to step 2
        setStep(2)
      } else {
        // Email confirmation required - show message
        setShowEmailConfirmation(true)
      }
    }
    setLoading(false)
  }

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!householdName.trim()) {
      setError('Huishouden naam is verplicht')
      return
    }
    
    setStep(3)
    setError(null)
  }

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate members
    const validMembers = members.filter(m => m.name.trim())
    if (validMembers.length === 0) {
      setError('Voeg minimaal 1 lid toe')
      setLoading(false)
      return
    }

    const supabase = createClient()

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user
      
      if (!currentUser) {
        // Not logged in - redirect to login
        router.push('/login?error=session_expired')
        return
      }

      // Create household with created_by
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ 
          name: householdName,
          created_by: currentUser.id 
        })
        .select()
        .single()

      if (householdError) throw householdError

      // Create members
      const membersToInsert = validMembers.map(member => ({
        household_id: household.id,
        name: member.name,
        role: member.role,
      }))

      const { error: membersError } = await supabase
        .from('household_members')
        .insert(membersToInsert)

      if (membersError) throw membersError

      // Success - redirect to week
      router.push('/week')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis')
      setLoading(false)
    }
  }

  const updateMember = (index: number, field: keyof MemberForm, value: string) => {
    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
  }

  const addMember = () => {
    if (members.length >= 4) return
    setMembers([...members, { name: '', role: 'member' }])
  }

  const removeMember = (index: number) => {
    if (members.length <= 1) return
    const newMembers = members.filter((_, i) => i !== index)
    setMembers(newMembers)
  }

  if (loadingUser) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-muted">Laden...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 className="text-3xl font-bold text-primary mb-2 text-center">
              Account maken
            </h1>
            <p className="text-muted text-center mb-8">
              Stap 1 van 3
            </p>

            {showEmailConfirmation ? (
              <div className="bg-success-50 border border-success-200 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📧</div>
                <h2 className="text-xl font-semibold text-success mb-2">
                  Check je e-mail!
                </h2>
                <p className="text-success-700 mb-4">
                  We hebben een bevestigingslink gestuurd naar <strong>{email}</strong>.
                </p>
                <p className="text-muted text-sm mb-4">
                  Klik op de link in de e-mail om je account te bevestigen. Daarna kun je verder met het instellen van je huishouden.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-success text-white py-3 px-4 rounded-xl font-medium hover:bg-success-600 transition-colors"
                >
                  Ik heb mijn e-mail bevestigd
                </button>
                <p className="text-sm text-muted mt-4">
                  Geen e-mail ontvangen? Check je spam folder of{' '}
                  <button 
                    onClick={() => setShowEmailConfirmation(false)}
                    className="text-primary hover:underline"
                  >
                    probeer opnieuw
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAccount} className="space-y-4">
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
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Minimaal 6 tekens"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Bezig...' : 'Account aanmaken'}
                </button>

                <p className="text-center text-sm text-muted">
                  Al een account?{' '}
                  <a href="/login" className="text-primary hover:underline">
                    Inloggen
                  </a>
                </p>
              </form>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-3xl font-bold text-primary mb-2 text-center">
              Huishouden
            </h1>
            <p className="text-muted text-center mb-8">
              Stap 2 van 3
            </p>

            {confirmed && (
              <div className="bg-success-50 border border-success-200 rounded-xl p-4 mb-6 text-center">
                <p className="text-success font-medium">
                  ✅ E-mail bevestigd! Je kunt nu verder.
                </p>
              </div>
            )}

            <form onSubmit={handleCreateHousehold} className="space-y-4">
              <div>
                <label htmlFor="householdName" className="block text-sm font-medium text-foreground mb-1">
                  Naam van je huishouden
                </label>
                <input
                  id="householdName"
                  type="text"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Bijv. Gezin De Jong"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                Doorgaan
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 text-muted hover:text-foreground transition-colors"
              >
                ← Terug
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-3xl font-bold text-primary mb-2 text-center">
              Gezinsleden
            </h1>
            <p className="text-muted text-center mb-8">
              Stap 3 van 3
            </p>

            <form onSubmit={handleCompleteSetup} className="space-y-4">
              {members.map((member, index) => (
                <div key={index} className="p-4 bg-white rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-muted">
                      Lid {index + 1} {index === 0 && '(jij)'}
                    </p>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(index)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Verwijder
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      placeholder="Naam"
                      className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                      value={member.role}
                      onChange={(e) => updateMember(index, 'role', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Lid</option>
                    </select>
                  </div>
                </div>
              ))}

              {members.length < 4 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted hover:border-primary hover:text-primary transition-colors"
                >
                  + Extra lid toevoegen ({members.length}/4)
                </button>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-success text-white py-3 px-4 rounded-xl font-medium hover:bg-success-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Bezig...' : 'Huishouden aanmaken'}
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 text-muted hover:text-foreground transition-colors"
              >
                ← Terug
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
