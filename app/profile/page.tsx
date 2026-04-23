'use client';

import { useState, Suspense, useEffect } from 'react';
import { User, Settings, Bell, Moon, Sun, LogOut, ChevronRight, Users, Shield } from 'lucide-react';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';

function ProfilePageContent() {
  const router = useRouter();
  const { vibrate } = useHaptic();
  const { currentUser, logoutUser, isAuthenticated } = useUserStore();
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    weekly: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/landing');
    }
  }, [isAuthenticated, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4A90A4]">Laden...</div>
      </div>
    );
  }

  // Get family name from user (stored in auth flow)
  const familyName = (currentUser as any).familyName || 'Mijn gezin';

  const handleToggleNotifications = (key: keyof typeof notifications) => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key} notificaties ${notifications[key] ? 'uit' : 'aan'}`);
  };

  const handleToggleDarkMode = () => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    setDarkMode(!darkMode);
    toast.info('Donkere modus komt binnenkort!');
  };

  const handleLogout = () => {
    vibrate(HAPTIC_PATTERNS.MEDIUM);
    logoutUser();
    toast.success('Je bent uitgelogd');
    router.push('/landing');
  };

  return (
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D3436]">Profiel</h1>
        <p className="text-sm text-gray-500">Beheer je account en instellingen</p>
      </div>

      {/* User card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-[#4A90A4]" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-[#2D3436]">{currentUser.name}</h2>
            <p className="text-sm text-gray-500">{(currentUser as any).email}</p>
            <p className="text-xs text-gray-400 mt-1">{familyName}</p>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaties
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <button
              onClick={() => handleToggleNotifications('push')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span>Push notificaties</span>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                notifications.push ? "bg-[#4A90A4]" : "bg-gray-300"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  notifications.push ? "left-7" : "left-1"
                )} />
              </div>
            </button>
            <button
              onClick={() => handleToggleNotifications('email')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span>E-mail notificaties</span>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                notifications.email ? "bg-[#4A90A4]" : "bg-gray-300"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  notifications.email ? "left-7" : "left-1"
                )} />
              </div>
            </button>
            <button
              onClick={() => handleToggleNotifications('weekly')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <span>Wekelijkse samenvatting</span>
              <div className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                notifications.weekly ? "bg-[#4A90A4]" : "bg-gray-300"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  notifications.weekly ? "left-7" : "left-1"
                )} />
              </div>
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Weergave
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <button
              onClick={handleToggleDarkMode}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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

        {/* Household */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Huishouden
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span>Gezinsleden beheren</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span>Uitnodigingen</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Security */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Beveiliging
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <span>Wachtwoord wijzigen</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Logout */}
        <section>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Uitloggen</span>
          </button>
        </section>

        {/* App info */}
        <div className="text-center text-sm text-gray-400 pt-4">
          <p>Rut v2.0.0</p>
          <p>© 2025 Rut App</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Uitloggen?</h2>
            <p className="text-gray-600 mb-6">
              Weet je zeker dat je wilt uitloggen? Je moet opnieuw inloggen om je gegevens te zien.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="px-4 py-6 w-full">Laden...</div>}>
        <ProfilePageContent />
      </Suspense>
    </AuthGuard>
  );
}
