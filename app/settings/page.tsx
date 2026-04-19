'use client';

import { useState, Suspense } from 'react';
import { Settings, Moon, Sun, Bell, Shield, Keyboard, ChevronRight, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

function SettingsPageContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    reminders: true,
    updates: false,
    weekly: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Instelling opgeslagen');
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D3436]">Instellingen</h1>
        <p className="text-sm text-gray-500">Beheer je voorkeuren</p>
      </div>

      {/* Account section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Account</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
            <User className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Profiel bewerken</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Privacy & Beveiliging</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </section>

      {/* Notifications section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Notificaties</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {Object.entries(notifications).map(([key, value], index, arr) => (
            <button
              key={key}
              onClick={() => toggleNotification(key as keyof typeof notifications)}
              className={cn(
                "w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors",
                index < arr.length - 1 && "border-b border-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <span>
                  {key === 'reminders' && 'Herinneringen'}
                  {key === 'updates' && 'App updates'}
                  {key === 'weekly' && 'Wekelijkse samenvatting'}
                </span>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                value ? "bg-[#4A90A4]" : "bg-gray-300"
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

      {/* Appearance section */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Weergave</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              toast.info('Donkere modus komt binnenkort!');
            }}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-gray-400" />}
              <span>Donkere modus</span>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              darkMode ? "bg-[#4A90A4]" : "bg-gray-300"
            )}>
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                darkMode ? "left-7" : "left-1"
              )} />
            </div>
          </button>
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Sneltoetsen</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
            <Keyboard className="w-5 h-5 text-gray-400" />
            <span className="flex-1 text-left">Toetsenbord sneltoetsen</span>
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
        <p>Rut v2.0.0</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="px-4 py-6 max-w-md mx-auto">Laden...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
