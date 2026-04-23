'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { Button } from '@/components/ui/Button';
import { ChefHat, Users, ArrowRight, X } from 'lucide-react';
import { toast } from '@/components/ui/Toast';

export default function SimpleAuthPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [familyName, setFamilyName] = useState('');
  const { addUser } = useUserStore();

  const handleNext = () => {
    console.log('handleNext called, current step:', step);
    if (step === 1 && name && familyName) {
      console.log('Going to step 2');
      setStep(2);
    } else if (step === 2) {
      console.log('Finishing setup');
      // Create user
      addUser({
        id: 'user_' + Date.now(),
        name: name,
        email: email,
        role: 'primary',
        goals: { trainingDaysPerWeek: 3, stepsTarget: 10000 },
        preferences: { dietary: [], dislikes: [], allergies: [], maxPrepTime: { breakfast: 15, lunch: 20, dinner: 45 }, budgetLevel: 'moderate' },
        schedule: { trainingDays: ['monday', 'wednesday', 'friday'], workBusyDays: [] },
        notifications: { pushEnabled: false, telegramEnabled: false, reminders: { breakfast: { enabled: false, time: '08:00' }, lunch: { enabled: false, time: '12:00' }, dinnerPrep: { enabled: false, time: '17:00' }, training: { enabled: false, time: '18:00' }, medication: { enabled: false, time: '09:00' } } },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Mark onboarding as complete
      localStorage.setItem('rut-onboarding-completed', 'true');
      toast.success('Welkom bij Rut!');
      
      // Redirect to app
      window.location.href = '/';
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Klaar!</h2>
          <p className="text-gray-600 mb-6">
            Welkom {name}! Je gezin "{familyName}" is aangemaakt.
          </p>
          <button
            onClick={handleNext}
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium"
          >
            Start met Rut
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#4A90A4] rounded-xl mx-auto mb-4 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#4A90A4]">Rut</h1>
          <p className="text-gray-600">Maak je gezin aan</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jouw naam</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Bijv. Jan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail (optioneel)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="jan@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gezinsnaam</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
              placeholder="Bijv. Het gezin van Jan"
            />
          </div>

          <button
            onClick={handleNext}
            disabled={!name || !familyName}
            className="w-full py-4 bg-[#4A90A4] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
      </div>
    </div>
  );
}
