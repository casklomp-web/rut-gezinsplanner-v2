'use client';

import { useState } from 'react';
import { ChefHat, ArrowRight, User, Users, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/lib/store/userStore';
import { generateSecureId } from '@/lib/auth/password';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Step = 'profile' | 'family' | 'preferences' | 'complete';

interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child' | 'other';
  color: string;
}

const COLORS = ['#4A90A4', '#7CB342', '#E17055', '#FDCB6E', '#6C5CE7', '#00B894'];

const ROLES = [
  { value: 'parent', label: 'Ouder' },
  { value: 'child', label: 'Kind' },
  { value: 'other', label: 'Anders' },
];

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('profile');
  const [name, setName] = useState('');
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'parent' | 'child' | 'other'>('parent');
  const [dietary, setDietary] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  
  const { currentUser, updateUser } = useUserStore();

  const handleNext = () => {
    if (step === 'profile') {
      if (!name.trim()) return;
      // Update user name
      if (currentUser) {
        updateUser(currentUser.id, { name: name.trim() });
      }
      setStep('family');
    } else if (step === 'family') {
      setStep('preferences');
    } else if (step === 'preferences') {
      // Save preferences
      if (currentUser) {
        updateUser(currentUser.id, {
          preferences: {
            ...currentUser.preferences,
            dietary,
            allergies,
          }
        });
      }
      setStep('complete');
    } else {
      onComplete();
    }
  };

  const addFamilyMember = () => {
    if (!newMemberName.trim()) return;
    
    const color = COLORS[familyMembers.length % COLORS.length];
    const newMember: FamilyMember = {
      id: generateSecureId(),
      name: newMemberName.trim(),
      role: newMemberRole,
      color,
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const toggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter(d => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const toggleAllergy = (item: string) => {
    if (allergies.includes(item)) {
      setAllergies(allergies.filter(a => a !== item));
    } else {
      setAllergies([...allergies, item]);
    }
  };

  const canProceed = () => {
    if (step === 'profile') return name.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A90A4]/10 via-[#4A90A4]/5 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {(['profile', 'family', 'preferences', 'complete'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                ['profile', 'family', 'preferences', 'complete'].indexOf(step) >= i
                  ? 'bg-[#4A90A4]'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#4A90A4]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-[#4A90A4]" />
                </div>
                <h1 className="text-2xl font-bold text-[#2D3436]">Jouw profiel</h1>
                <p className="text-gray-600">Hoe mogen we je noemen?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jouw naam *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                    placeholder="Bijv. Jan"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'family' && (
            <motion.div
              key="family"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#4A90A4]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#4A90A4]" />
                </div>
                <h1 className="text-2xl font-bold text-[#2D3436]">Gezinsleden</h1>
                <p className="text-gray-600">Voeg je gezin toe</p>
              </div>

              {/* Family members list */}
              {familyMembers.length > 0 && (
                <div className="space-y-2 mb-4">
                  {familyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: member.color }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{member.name}</p>
                          <p className="text-xs text-gray-500">
                            {ROLES.find(r => r.value === member.role)?.label}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFamilyMember(member.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Verwijder
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add member */}
              <div className="space-y-3">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  placeholder="Naam gezinslid"
                  onKeyPress={(e) => e.key === 'Enter' && addFamilyMember()}
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                >
                  {ROLES.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addFamilyMember}
                  disabled={!newMemberName.trim()}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  Toevoegen
                </button>
              </div>
            </motion.div>
          )}

          {step === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#4A90A4]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#4A90A4]" />
                </div>
                <h1 className="text-2xl font-bold text-[#2D3436]">Voorkeuren</h1>
                <p className="text-gray-600">Zodat we betere suggesties kunnen doen</p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-medium text-gray-700 mb-3">Dieetvoorkeuren</p>
                  <div className="flex flex-wrap gap-2">
                    {['Vegetarisch', 'Veganistisch', 'Glutenvrij', 'Lactosevrij', 'Keto', 'Paleo'].map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleDietary(item)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          dietary.includes(item)
                            ? 'bg-[#4A90A4] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-3">Allergieën</p>
                  <div className="flex flex-wrap gap-2">
                    {['Noten', 'Pinda', 'Gluten', 'Lactose', 'Eieren', 'Schaaldieren', 'Soja'].map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleAllergy(item)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          allergies.includes(item)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#2D3436] mb-2">Klaar!</h1>
              <p className="text-gray-600 mb-6">
                Welkom bij Rut, {name}! Je kunt nu beginnen met plannen.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <p className="font-medium text-gray-700 mb-2">Samenvatting:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Jouw profiel: {name}</li>
                  <li>• Gezinsleden: {familyMembers.length + 1}</li>
                  <li>• Dieetvoorkeuren: {dietary.length > 0 ? dietary.join(', ') : 'Geen'}</li>
                  <li>• Allergieën: {allergies.length > 0 ? allergies.join(', ') : 'Geen'}</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          {step !== 'profile' && step !== 'complete' && (
            <button
              onClick={() => {
                const steps: Step[] = ['profile', 'family', 'preferences', 'complete'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex - 1]);
              }}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
            >
              Terug
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 py-4 bg-[#4A90A4] text-white rounded-xl font-medium hover:bg-[#3a7a8c] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center">
              {step === 'complete' ? 'Start met Rut' : 'Volgende'}
              {step !== 'complete' && <ArrowRight className="w-5 h-5 ml-2" />}
            </span>
          </button>
        </div>

        {/* Skip */}
        {step !== 'complete' && (
          <button
            onClick={onSkip}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Overslaan
          </button>
        )}
      </motion.div>
    </div>
  );
}
