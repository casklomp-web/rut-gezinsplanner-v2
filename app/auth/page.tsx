'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { ChefHat, ArrowRight, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function AuthPage() {
  const { users, addUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [newMemberName, setNewMemberName] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const hasCompletedOnboarding = localStorage.getItem('rut-onboarding-completed');
      const hasUsers = users.length > 0;
      
      if (hasCompletedOnboarding || hasUsers) {
        window.location.href = '/today';
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [users]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !familyName) {
      toast.error('Vul alle velden in');
      return;
    }
    setStep(2);
  };

  const addFamilyMember = () => {
    if (newMemberName.trim()) {
      setFamilyMembers([...familyMembers, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    // Create primary user
    addUser({
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      role: 'primary',
      goals: { trainingDaysPerWeek: 3, stepsTarget: 10000 },
      preferences: { 
        dietary: [], 
        dislikes: [], 
        allergies: [], 
        maxPrepTime: { breakfast: 15, lunch: 20, dinner: 45 }, 
        budgetLevel: 'moderate' 
      },
      schedule: { trainingDays: ['monday', 'wednesday', 'friday'], workBusyDays: [] },
      notifications: { 
        pushEnabled: false, 
        telegramEnabled: false, 
        reminders: { 
          breakfast: { enabled: false, time: '08:00' }, 
          lunch: { enabled: false, time: '12:00' }, 
          dinnerPrep: { enabled: false, time: '17:00' }, 
          training: { enabled: false, time: '18:00' }, 
          medication: { enabled: false, time: '09:00' } 
        } 
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
        goals: { trainingDaysPerWeek: 3, stepsTarget: 10000 },
        preferences: { 
          dietary: [], 
          dislikes: [], 
          allergies: [], 
          maxPrepTime: { breakfast: 15, lunch: 20, dinner: 45 }, 
          budgetLevel: 'moderate' 
        },
        schedule: { trainingDays: [], workBusyDays: [] },
        notifications: { 
          pushEnabled: false, 
          telegramEnabled: false, 
          reminders: { 
            breakfast: { enabled: false, time: '08:00' }, 
            lunch: { enabled: false, time: '12:00' }, 
            dinnerPrep: { enabled: false, time: '17:00' }, 
            training: { enabled: false, time: '18:00' }, 
            medication: { enabled: false, time: '09:00' } 
          } 
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    localStorage.setItem('rut-onboarding-completed', 'true');
    toast.success('Welkom bij Rut!');
    window.location.href = '/today';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#4A90A4] rounded-xl mx-auto mb-4 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A90A4]">Gezinsleden</h1>
            <p className="text-gray-600">Voeg andere gezinsleden toe aan {familyName}</p>
          </div>

          {/* Primary user */}
          <div className="bg-[#4A90A4]/10 rounded-xl p-4 mb-4">
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-sm text-gray-500">Beheerder</p>
          </div>

          {/* Family members list */}
          {familyMembers.length > 0 && (
            <div className="space-y-2 mb-4">
              {familyMembers.map((member, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-gray-800">{member}</span>
                  <button
                    onClick={() => removeFamilyMember(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
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
              onKeyPress={(e) => e.key === 'Enter' && addFamilyMember()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Naam gezinslid"
            />
            <button
              onClick={addFamilyMember}
              disabled={!newMemberName.trim()}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors"
          >
            <span className="flex items-center justify-center">
              {familyMembers.length > 0 
                ? `Start met ${familyMembers.length + 1} gezinsleden` 
                : 'Start alleen'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </button>

          <button
            onClick={() => setStep(1)}
            className="w-full py-3 text-gray-500 hover:text-gray-700 mt-2"
          >
            ← Terug
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <form onSubmit={handleNext} className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#4A90A4] rounded-xl mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#4A90A4]">Rut</h1>
          <p className="text-gray-600">Maak je gezin aan</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jouw naam *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Bijv. Jan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="jan@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gezinsnaam *</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Bijv. Het gezin van Jan"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] transition-colors"
          >
            <span className="flex items-center justify-center">
              Volgende
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Door verder te gaan accepteer je onze voorwaarden
        </p>
      </form>
    </div>
  );
}
