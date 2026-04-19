/**
 * Settings Page with Tabs
 * Comprehensive settings with tabbed interface
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Shield, 
  MessageCircle, 
  ChevronRight,
  Moon,
  Smartphone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { SettingsSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';

type TabType = 'notifications' | 'account' | 'privacy' | 'preferences';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('notifications');
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    pushEnabled: true,
    emailEnabled: false,
    reminderBreakfast: true,
    reminderLunch: true,
    reminderDinner: true,
    reminderTraining: false,
    reminderMedication: true,
    reminderShopping: true,
    
    // Preferences
    darkMode: false,
    compactView: false,
    autoGenerateWeek: true,
    weekStartDay: 'monday',
    
    // Privacy
    shareData: false,
    analyticsEnabled: true,
    
    // Account
    language: 'nl',
    timezone: 'Europe/Amsterdam'
  });
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);
  
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Instelling opgeslagen');
  };
  
  const tabs = [
    { id: 'notifications' as TabType, label: 'Notificaties', icon: Bell },
    { id: 'preferences' as TabType, label: 'Voorkeuren', icon: Moon },
    { id: 'account' as TabType, label: 'Account', icon: User },
    { id: 'privacy' as TabType, label: 'Privacy', icon: Shield }
  ];
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <SettingsSkeleton />
      </div>
    );
  }
  
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-[#2D3436] mb-6">
        Instellingen
      </h1>
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-6 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#4A90A4] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Push Notificaties
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4A90A4]/10 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-[#4A90A4]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D3436]">Push notificaties</p>
                      <p className="text-sm text-gray-500">Ontvang meldingen op je telefoon</p>
                    </div>
                  </div>
                  <Toggle
                    checked={settings.pushEnabled}
                    onChange={() => updateSetting('pushEnabled', !settings.pushEnabled)}
                  />
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D3436]">E-mail notificaties</p>
                      <p className="text-sm text-gray-500">Ontvang wekelijkse samenvattingen</p>
                    </div>
                  </div>
                  <Toggle
                    checked={settings.emailEnabled}
                    onChange={() => updateSetting('emailEnabled', !settings.emailEnabled)}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Herinneringen
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {[
                  { key: 'reminderBreakfast', label: 'Ontbijt', time: '07:30' },
                  { key: 'reminderLunch', label: 'Lunch', time: '12:00' },
                  { key: 'reminderDinner', label: 'Diner voorbereiden', time: '17:00' },
                  { key: 'reminderTraining', label: 'Training', time: '18:00' },
                  { key: 'reminderMedication', label: 'Medicatie', time: '08:00' },
                  { key: 'reminderShopping', label: 'Boodschappen', time: '09:00' }
                ].map(reminder => (
                  <div key={reminder.key} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#2D3436]">{reminder.label}</p>
                      <p className="text-sm text-gray-500">{reminder.time}</p>
                    </div>
                    <Toggle
                      checked={settings[reminder.key as keyof typeof settings] as boolean}
                      onChange={() => updateSetting(reminder.key, !settings[reminder.key as keyof typeof settings])}
                    />
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Telegram
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2D3436]">Telegram integratie</p>
                    <p className="text-sm text-gray-500">Stuur weekoverzichten naar Telegram</p>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Chat ID (bijv. -1001234567890)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4] mb-3"
                />
                <Button variant="outline" className="w-full">
                  Koppelen
                </Button>
              </div>
            </section>
          </>
        )}
        
        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <>
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Weergave
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Moon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D3436]">Donkere modus</p>
                      <p className="text-sm text-gray-500">Minder fel licht &apos;s avonds</p>
                    </div>
                  </div>
                  <Toggle
                    checked={settings.darkMode}
                    onChange={() => updateSetting('darkMode', !settings.darkMode)}
                  />
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2D3436]">Compacte weergave</p>
                    <p className="text-sm text-gray-500">Meer informatie op het scherm</p>
                  </div>
                  <Toggle
                    checked={settings.compactView}
                    onChange={() => updateSetting('compactView', !settings.compactView)}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Week planning
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2D3436]">Automatisch genereren</p>
                    <p className="text-sm text-gray-500">Genereer automatisch een nieuwe week</p>
                  </div>
                  <Toggle
                    checked={settings.autoGenerateWeek}
                    onChange={() => updateSetting('autoGenerateWeek', !settings.autoGenerateWeek)}
                  />
                </div>
                
                <div className="p-4">
                  <p className="font-medium text-[#2D3436] mb-2">Week start op</p>
                  <select
                    value={settings.weekStartDay}
                    onChange={(e) => updateSetting('weekStartDay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  >
                    <option value="monday">Maandag</option>
                    <option value="sunday">Zondag</option>
                  </select>
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Account Tab */}
        {activeTab === 'account' && (
          <>
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Taal & Regio
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="p-4">
                  <p className="font-medium text-[#2D3436] mb-2">Taal</p>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  >
                    <option value="nl">Nederlands</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="p-4">
                  <p className="font-medium text-[#2D3436] mb-2">Tijdzone</p>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                  >
                    <option value="Europe/Amsterdam">Amsterdam (CET)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="America/New_York">New York (EST)</option>
                  </select>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Data
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <button 
                  onClick={() => toast.info('Export functionaliteit komt binnenkort')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-[#2D3436]">Exporteer data</p>
                    <p className="text-sm text-gray-500">Download al je gegevens</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => {
                    if (confirm('Weet je zeker dat je alle data wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
                      toast.success('Data verwijderd');
                    }
                  }}
                  className="w-full p-4 flex items-center justify-between hover:bg-red-50"
                >
                  <div>
                    <p className="font-medium text-red-600">Verwijder alle data</p>
                    <p className="text-sm text-gray-500">Dit kan niet ongedaan worden gemaakt</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </section>
          </>
        )}
        
        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <>
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Privacy
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2D3436]">Anonieme data delen</p>
                    <p className="text-sm text-gray-500">Help ons de app te verbeteren</p>
                  </div>
                  <Toggle
                    checked={settings.shareData}
                    onChange={() => updateSetting('shareData', !settings.shareData)}
                  />
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#2D3436]">Analytics</p>
                    <p className="text-sm text-gray-500">Gebruiksstatistieken verzamelen</p>
                  </div>
                  <Toggle
                    checked={settings.analyticsEnabled}
                    onChange={() => updateSetting('analyticsEnabled', !settings.analyticsEnabled)}
                  />
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                Beveiliging
              </h2>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <button 
                  onClick={() => toast.info('Wachtwoord wijzigen komt binnenkort')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-[#2D3436]">Wachtwoord wijzigen</p>
                    <p className="text-sm text-gray-500">Update je wachtwoord</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button 
                  onClick={() => toast.info('2FA komt binnenkort')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-[#2D3436]">Tweestapsverificatie</p>
                    <p className="text-sm text-gray-500">Extra beveiliging voor je account</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </section>
          </>
        )}
      </div>
      
      {/* App Info */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">Rut - Gezinsplanner</p>
        <p className="text-xs text-gray-400">Versie 2.0.0</p>
        <p className="text-xs text-gray-400 mt-1">
          Gebouwd met ❤️ voor drukke gezinnen
        </p>
      </div>
    </div>
  );
}
