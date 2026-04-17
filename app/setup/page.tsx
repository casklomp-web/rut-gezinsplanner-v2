'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

interface MemberForm {
  name: string
  role: 'admin' | 'member'
}

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  
  // Step 1: Account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Step 2: Household
  const [householdName, setHouseholdName] = useState('')
  
  // Step 3: Members
  const [members, setMembers] = useState<MemberForm[]>([
    { name: '', role: 'admin' },
    { name: '', role: 'member' }
  ])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setStep(2)
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Geen gebruiker gevonden')

      // Create household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ name: householdName })
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
                {loading ? 'Bezig...' : 'Doorgaan'}
              </button>
            </form>
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
                  <p className="text-sm font-medium text-muted mb-2">
                    Lid {index + 1}
                  </p>
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

        <p className="text-center mt-6 text-muted">
          Al een account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Inloggen
          </a>
        </p>
      </div>
    </main>
  )
}
