/**
 * Profile Page
 * Edit user profile and manage household
 */

'use client';

import { useState, useEffect } from 'react';
import { User, Users, Home, LogOut, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/ErrorBoundary';
import { toast } from '@/components/ui/Toast';
import { useSupabaseUserStore } from '@/lib/store/supabaseUserStore';

export default function ProfilePage() {
  const { 
    profile, 
    preferences, 
    household, 
    isLoading, 
    loadUserData, 
    updateProfile,
    createHousehold,
    joinHousehold
  } = useSupabaseUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [inviteCode, setInviteCode] = useState('');
  const [showJoinHousehold, setShowJoinHousehold] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // In a real app, you'd get the user ID from auth
    // loadUserData('user_id');
  }, []);
  
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || ''
      });
    }
  }, [profile]);
  
  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name: formData.name });
      setIsEditing(false);
      toast.success('Profiel bijgewerkt');
    } catch (error) {
      toast.error('Kon profiel niet bijwerken');
    }
  };
  
  const handleCreateHousehold = async () => {
    try {
      const name = prompt('Naam voor je huishouden:');
      if (name) {
        await createHousehold(name);
        toast.success('Huishouden aangemaakt');
      }
    } catch (error) {
      toast.error('Kon huishouden niet aanmaken');
    }
  };
  
  const handleJoinHousehold = async () => {
    try {
      await joinHousehold(inviteCode);
      toast.success('Je bent toegevoegd aan het huishouden');
      setShowJoinHousehold(false);
      setInviteCode('');
    } catch (error) {
      toast.error('Ongeldige uitnodigingscode');
    }
  };
  
  const copyInviteCode = () => {
    if (household?.invite_code) {
      navigator.clipboard.writeText(household.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code gekopieerd');
    }
  };
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <ProfileSkeleton />
      </div>
    );
  }
  
  // For demo purposes, show the UI without actual data
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-[#2D3436] mb-6">
        Profiel
      </h1>
      
      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-[#4A90A4]" />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="font-semibold text-lg border-b-2 border-[#4A90A4] focus:outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h2 className="font-semibold text-lg text-[#2D3436]">
                {profile?.name || 'Cas'}
              </h2>
            )}
            <p className="text-gray-500 text-sm">
              {profile?.role === 'primary' ? 'Hoofdgebruiker' : 'Partner'}
            </p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
              Annuleren
            </Button>
            <Button onClick={handleSaveProfile} className="flex-1">
              Opslaan
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full">
            Profiel bewerken
          </Button>
        )}
      </div>
      
      {/* Household Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Huishouden
        </h2>
        
        {household ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#4A90A4]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#2D3436]">{household.name}</h3>
                  <p className="text-sm text-gray-500">
                    {household.member_count || 2} leden
                  </p>
                </div>
              </div>
            </div>
            
            {/* Invite code */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Uitnodigingscode</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded-lg font-mono text-sm border border-gray-200">
                  {household.invite_code || 'ABC12345'}
                </code>
                <button
                  onClick={copyInviteCode}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Deel deze code om anderen uit te nodigen
              </p>
            </div>
            
            {/* Members */}
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Leden</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-[#4A90A4]" />
                  </div>
                  <span className="text-sm">Cas (jij)</span>
                  <span className="text-xs bg-[#4A90A4]/10 text-[#4A90A4] px-2 py-0.5 rounded-full ml-auto">
                    Admin
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm">Partner</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-[#2D3436] mb-1">
              Geen huishouden
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Maak een huishouden aan of sluit je aan bij een bestaand huishouden
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowJoinHousehold(true)} className="flex-1">
                Deelnemen
              </Button>
              <Button onClick={handleCreateHousehold} className="flex-1">
                Aanmaken
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Join Household Modal */}
      {showJoinHousehold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Deelnemen aan huishouden</h2>
            <p className="text-sm text-gray-600 mb-4">
              Voer de uitnodigingscode in die je hebt ontvangen
            </p>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Bijv. ABC12345"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A90A4] mb-4 font-mono"
              maxLength={8}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowJoinHousehold(false)} className="flex-1">
                Annuleren
              </Button>
              <Button 
                onClick={handleJoinHousehold} 
                disabled={inviteCode.length < 6}
                className="flex-1"
              >
                Deelnemen
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Links */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Instellingen
        </h2>
        
        <a
          href="/settings"
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-[#4A90A4] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-medium">Algemene instellingen</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>
        
        <button
          onClick={() => toast.info('Uitloggen nog niet geïmplementeerd')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-medium text-red-600">Uitloggen</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
