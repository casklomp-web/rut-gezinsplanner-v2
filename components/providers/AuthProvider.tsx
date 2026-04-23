'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { ChefHat, Users, ArrowRight } from 'lucide-react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { currentUser, users } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('rut-onboarding-completed');
    
    if (!hasCompletedOnboarding && users.length === 0) {
      setShowAuth(true);
    }
    
    setIsLoading(false);
  }, [users.length]);

  const login = () => {
    localStorage.setItem('rut-onboarding-completed', 'true');
    setShowAuth(false);
  };

  const logout = () => {
    localStorage.removeItem('rut-onboarding-completed');
    setShowAuth(true);
  };

  const isAuthenticated = !showAuth && (users.length > 0 || currentUser !== null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthScreen onComplete={login} />
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AuthScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<'welcome' | 'create-family' | 'add-members'>('welcome');
  const { addUser } = useUserStore();
  const [familyName, setFamilyName] = useState('');
  const [primaryUser, setPrimaryUser] = useState({ name: '', email: '' });
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [newMemberName, setNewMemberName] = useState('');

  // Debug: log step changes
  useEffect(() => {
    console.log('Step changed to:', step);
  }, [step]);

  const handleCreateFamily = () => {
    console.log('handleCreateFamily called', { familyName, primaryUser: primaryUser.name });
    if (familyName && primaryUser.name) {
      console.log('Setting step to add-members...');
      setStep('add-members');
      console.log('Step should now be add-members');
    } else {
      console.log('Button disabled - missing data');
    }
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      setFamilyMembers([...familyMembers, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleFinishSetup = () => {
    // Create primary user
    addUser({
      id: 'user_' + Date.now(),
      name: primaryUser.name,
      email: primaryUser.email,
      role: 'primary',
      goals: {
        trainingDaysPerWeek: 3,
        stepsTarget: 10000,
      },
      preferences: {
        dietary: [],
        dislikes: [],
        allergies: [],
        maxPrepTime: {
          breakfast: 15,
          lunch: 20,
          dinner: 45,
        },
        budgetLevel: 'moderate',
      },
      schedule: {
        trainingDays: ['monday', 'wednesday', 'friday'],
        workBusyDays: [],
      },
      notifications: {
        pushEnabled: false,
        telegramEnabled: false,
        reminders: {
          breakfast: { enabled: false, time: '08:00' },
          lunch: { enabled: false, time: '12:00' },
          dinnerPrep: { enabled: false, time: '17:00' },
          training: { enabled: false, time: '18:00' },
          medication: { enabled: false, time: '09:00' },
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add family members
    familyMembers.forEach((memberName, index) => {
      addUser({
        id: 'user_' + (Date.now() + index + 1),
        name: memberName,
        email: '',
        role: 'member',
        goals: {
          trainingDaysPerWeek: 3,
          stepsTarget: 10000,
        },
        preferences: {
          dietary: [],
          dislikes: [],
          allergies: [],
          maxPrepTime: {
            breakfast: 15,
            lunch: 20,
            dinner: 45,
          },
          budgetLevel: 'moderate',
        },
        schedule: {
          trainingDays: [],
          workBusyDays: [],
        },
        notifications: {
          pushEnabled: false,
          telegramEnabled: false,
          reminders: {
            breakfast: { enabled: false, time: '08:00' },
            lunch: { enabled: false, time: '12:00' },
            dinnerPrep: { enabled: false, time: '17:00' },
            training: { enabled: false, time: '18:00' },
            medication: { enabled: false, time: '09:00' },
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    onComplete();
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#4A90A4] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#4A90A4] mb-3">Welkom bij Rut</h1>
          <p className="text-gray-600 mb-8">
            Jouw persoonlijke gezinsplanner voor gezond eten en een actieve levensstijl.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setStep('create-family')}
              className="w-full py-4 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Start met je gezin
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            Door verder te gaan accepteer je onze voorwaarden
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button 
          onClick={() => setStep('welcome')}
          className="text-sm text-[#4A90A4] mb-4"
        >
          ← Terug
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Maak je gezin aan</h2>
        <p className="text-gray-600 mb-6">
          Vertel ons iets over jezelf om te beginnen.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jouw naam
            </label>
            <input
              type="text"
              value={primaryUser.name}
              onChange={(e) => setPrimaryUser({ ...primaryUser, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Bijv. Jan"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail (optioneel)
            </label>
            <input
              type="email"
              value={primaryUser.email}
              onChange={(e) => setPrimaryUser({ ...primaryUser, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="jan@voorbeeld.nl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gezinsnaam
            </label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Bijv. Het gezin van Jan"
            />
          </div>
          
          <button
            onClick={handleCreateFamily}
            disabled={!familyName || !primaryUser.name}
            className="w-full py-4 text-lg mt-4 bg-[#4A90A4] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <span className="flex items-center justify-center">
              Volgende
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 'add-members') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button 
            onClick={() => setStep('create-family')}
            className="text-sm text-[#4A90A4] mb-4"
          >
            ← Terug
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Gezinsleden toevoegen</h2>
          <p className="text-gray-600 mb-6">
            Voeg andere gezinsleden toe aan {familyName}.
          </p>
          
          {/* Primary user */}
          <div className="bg-[#4A90A4]/10 rounded-xl p-4 mb-4">
            <p className="font-medium text-gray-800">{primaryUser.name}</p>
            <p className="text-sm text-gray-500">Beheerder</p>
          </div>

          {/* Family members list */}
          {familyMembers.length > 0 && (
            <div className="space-y-2 mb-4">
              {familyMembers.map((member, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-gray-800">{member}</span>
                  <button
                    onClick={() => setFamilyMembers(familyMembers.filter((_, i) => i !== index))}
                    className="text-red-500 text-sm"
                  >
                    Verwijder
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add member input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Naam gezinslid"
            />
            <Button
              onClick={handleAddMember}
              disabled={!newMemberName.trim()}
              variant="outline"
            >
              Toevoegen
            </Button>
          </div>
          
          <Button 
            onClick={handleFinishSetup}
            className="w-full py-4 text-lg"
          >
            {familyMembers.length > 0 ? `Start met ${familyMembers.length + 1} gezinsleden` : 'Start alleen'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
