'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { ChefHat, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

// Simple redirect after auth
function redirectToApp() {
  if (typeof window !== 'undefined') {
    window.location.href = '/today';
  }
}

export default function AuthPage() {
  const { users, addUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [familyName, setFamilyName] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const hasCompletedOnboarding = localStorage.getItem('rut-onboarding-completed');
      const hasUsers = users.length > 0;
      
      console.log('Auth check:', { hasCompletedOnboarding, hasUsers, users });
      
      if (hasCompletedOnboarding || hasUsers) {
        console.log('Already authenticated, redirecting...');
        redirectToApp();
      } else {
        console.log('Not authenticated, showing form');
        setIsLoading(false);
        setShowForm(true);
      }
    };
    
    checkAuth();
  }, [users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { name, familyName });
    
    if (!name || !familyName) {
      toast.error('Vul alle velden in');
      return;
    }

    // Create user
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

    // Mark as complete
    localStorage.setItem('rut-onboarding-completed', 'true');
    
    toast.success('Welkom bij Rut!');
    
    // Redirect
    console.log('Redirecting to app...');
    redirectToApp();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  if (!showForm) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
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
              Start met Rut
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
