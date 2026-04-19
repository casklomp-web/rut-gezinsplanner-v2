'use client';

import { useState } from 'react';
import { Bell, Clock, Calendar, Smartphone, Mail, MessageCircle, X, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskReminder, TaskNotificationPrefs } from '@/lib/types/task';

interface ReminderPickerProps {
  reminder?: TaskReminder;
  onChange: (reminder: TaskReminder | undefined) => void;
  notifications: TaskNotificationPrefs;
  onNotificationsChange: (prefs: TaskNotificationPrefs) => void;
}

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const daysOfWeek: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'monday', label: 'Maandag', short: 'Ma' },
  { value: 'tuesday', label: 'Dinsdag', short: 'Di' },
  { value: 'wednesday', label: 'Woensdag', short: 'Wo' },
  { value: 'thursday', label: 'Donderdag', short: 'Do' },
  { value: 'friday', label: 'Vrijdag', short: 'Vr' },
  { value: 'saturday', label: 'Zaterdag', short: 'Za' },
  { value: 'sunday', label: 'Zondag', short: 'Zo' },
];

export function ReminderPicker({
  reminder,
  onChange,
  notifications,
  onNotificationsChange,
}: ReminderPickerProps) {
  const [isExpanded, setIsExpanded] = useState(reminder?.enabled || false);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);

  const handleToggle = () => {
    const newEnabled = !isExpanded;
    setIsExpanded(newEnabled);
    onChange(
      newEnabled
        ? {
            enabled: true,
            time: reminder?.time || '09:00',
          }
        : undefined
    );
  };

  const handleTimeChange = (time: string) => {
    onChange({
      enabled: true,
      time,
    });
  };

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4A90A4]/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#4A90A4]" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Herinnering
            </p>
            <p className="text-sm text-gray-500">
              Ontvang een melding voor deze taak
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
            isExpanded ? 'bg-[#4A90A4]' : 'bg-gray-300 dark:bg-gray-600'
          )}
        >
          <span
            className={cn(
              'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
              isExpanded ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="space-y-4 pl-13">
          {/* Time Picker */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Clock className="w-4 h-4" />
              Tijd
            </label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={reminder?.time || '09:00'}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-lg font-medium"
              />
              <span className="text-sm text-gray-500">
                {parseInt(reminder?.time?.split(':')[0] || '9') < 12 ? 'AM' : 'PM'}
              </span>
            </div>
          </div>

          {/* Days Selection */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="w-4 h-4" />
              Dagen
            </label>
            <div className="flex gap-1">
              {daysOfWeek.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={cn(
                    'w-9 h-9 rounded-lg text-xs font-medium transition-colors',
                    selectedDays.includes(day.value)
                      ? 'bg-[#4A90A4] text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
                  )}
                  title={day.label}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Channels */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Meldingen via
            </label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Push notificatie
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) =>
                    onNotificationsChange({ ...notifications, push: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-[#4A90A4] focus:ring-[#4A90A4]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 block">
                      Telegram
                    </span>
                    <span className="text-xs text-gray-400">Via bot melding</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.telegram}
                  onChange={(e) =>
                    onNotificationsChange({ ...notifications, telegram: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-[#4A90A4] focus:ring-[#4A90A4]"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 cursor-pointer transition-colors opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 block">
                      E-mail
                    </span>
                    <span className="text-xs text-gray-400">Binnenkort beschikbaar</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                  className="w-5 h-5 rounded border-gray-300"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact reminder badge
export function ReminderBadge({
  time,
  enabled,
  className,
}: {
  time?: string;
  enabled?: boolean;
  className?: string;
}) {
  if (!enabled || !time) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full',
        className
      )}
    >
      <Bell className="w-3 h-3" />
      {time}
    </span>
  );
}

// Push notification placeholder component
export function PushNotificationPlaceholder() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-dashed border-gray-300 dark:border-gray-600">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            Push notificaties
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Ontvang meldingen op je telefoon wanneer taken verlopen of herinneringen
            geactiveerd worden. Dit vereist toestemming voor notificaties.
          </p>
          <button
            type="button"
            className="mt-3 px-4 py-2 bg-[#4A90A4] text-white text-sm font-medium rounded-lg hover:bg-[#3a7a8c] transition-colors"
          >
            Notificaties inschakelen
          </button>
        </div>
      </div>
    </div>
  );
}
