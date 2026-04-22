'use client';

import { useState, Suspense } from 'react';
import { User, Settings, Bell, Moon, Sun, Keyboard, HelpCircle, ChevronRight } from 'lucide-react';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';
import { useKeyboardShortcutsHelp } from '@/components/providers/KeyboardShortcutsProvider';
import { toast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/components/providers/FeatureProvider';

function ProfilePageContent() {
  const { vibrate } = useHaptic();
  const { shortcuts } = useKeyboardShortcutsHelp();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    weekly: true,
  });
  const [darkMode, setDarkMode] = useState(false);

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

  const handleShowShortcuts = () => {
    vibrate(HAPTIC_PATTERNS.LIGHT);
    setShowShortcuts(true);
  };

  return (
    <div className="px-4 py-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2D3436]">Profiel</h1>
        <p className="text-sm text-gray-500">Beheer je instellingen</p>
      </div>

      {/* User card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-[#4A90A4]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2D3436]">Gebruiker</h2>
            <p className="text-sm text-gray-500">Familie account</p>
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

        {/* Keyboard shortcuts */}
        {isFeatureEnabled('ENABLE_KEYBOARD_SHORTCUTS') && (
          <section>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Sneltoetsen
            </h3>
            <button
              onClick={handleShowShortcuts}
              className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span>Bekijk alle sneltoetsen</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </section>
        )}

        {/* Help */}
        <section>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Help
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
              Veelgestelde vragen
            </button>
            <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
              Contact opnemen
            </button>
            <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
              Privacy beleid
            </button>
          </div>
        </section>

        {/* App info */}
        <div className="text-center text-sm text-gray-400 pt-4">
          <p>Rut v2.0.0</p>
          <p>© 2025 Rut App</p>
        </div>
      </div>

      {/* Shortcuts modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Sneltoetsen</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowShortcuts(false)}
                className="w-full py-2 bg-[#4A90A4] text-white rounded-lg hover:bg-[#3a7a8c] transition-colors"
              >
                Sluiten
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
    <Suspense fallback={<div className="px-4 py-6 w-full">Laden...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
