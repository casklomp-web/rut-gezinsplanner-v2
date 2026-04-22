'use client';

import { useState, Suspense } from 'react';
import { Settings, Bell, Shield, Keyboard, ChevronRight, User, LogOut, Users, Mic, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { DarkModeToggle } from '@/components/features/DarkModeToggle';
import { ExportImportPanel } from '@/components/features/ExportImportPanel';
import { InviteLinkGenerator } from '@/components/features/SocialShareButtons';
import { VoiceCommandHelp } from '@/components/features/VoiceInputButton';
import { useWeekStore } from '@/lib/store/weekStore';
import { useUserStore } from '@/lib/store/userStore';
import { meals as defaultMeals } from '@/lib/data/meals';

function SettingsPageContent() {
  const [notifications, setNotifications] = useState({
    reminders: true,
    updates: false,
    weekly: true,
  });
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  
  const { currentWeek, weekHistory } = useWeekStore();
  const { currentUser, users } = useUserStore();

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Instelling opgeslagen');
  };

  const handleImport = (data: { weeks?: typeof currentWeek[]; recipes?: typeof defaultMeals; user?: typeof currentUser }) => {
    // Handle import logic
    toast.success('Data geïmporteerd');
  };

  return (
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D3436] dark:text-gray-100">Instellingen</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Beheer je voorkeuren</p>
      </div>

      {/* Account section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Account</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <User className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left dark:text-gray-200">Profiel bewerken</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left dark:text-gray-200">Privacy & Beveiliging</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Appearance section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Weergave</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <DarkModeToggle variant="full" />
        </div>
      </section>

      {/* Notifications section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Notificaties</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {Object.entries(notifications).map(([key, value], index, arr) => (
            <button
              key={key}
              onClick={() => toggleNotification(key as keyof typeof notifications)}
              className={cn(
                "w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                index < arr.length - 1 && "border-b border-gray-100 dark:border-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="dark:text-gray-200">
                  {key === 'reminders' && 'Herinneringen'}
                  {key === 'updates' && 'App updates'}
                  {key === 'weekly' && 'Wekelijkse samenvatting'}
                </span>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                value ? "bg-[#4A90A4]" : "bg-gray-300 dark:bg-gray-600"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  value ? "left-7" : "left-1"
                )} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Household section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Huishouden</h2>
        <InviteLinkGenerator
          householdId="household_123"
          inviterName={currentUser?.name || 'Gebruiker'}
        />
      </section>

      {/* Data Management */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Data</h2>
        <ExportImportPanel
          weeks={currentWeek ? [currentWeek, ...weekHistory] : []}
          recipes={defaultMeals}
          user={currentUser}
          onImport={handleImport}
        />
      </section>

      {/* Voice Commands */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Spraak</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setShowVoiceHelp(true)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Mic className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left dark:text-gray-200">Spraakcommando&apos;s</span>
            <HelpCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Sneltoetsen</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Keyboard className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left dark:text-gray-200">Toetsenbord sneltoetsen</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-sm font-medium text-red-500 uppercase tracking-wide mb-3">Gevarenzone</h2>
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => toast.error('Uitloggen nog niet geïmplementeerd')}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </Button>
      </section>

      {/* Version */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>Rut v2.0.0 - Met 10 nieuwe features!</p>
      </div>

      {/* Voice Help Modal */}
      <VoiceCommandHelp isOpen={showVoiceHelp} onClose={() => setShowVoiceHelp(false)} />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 w-full">Laden...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
