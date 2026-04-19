'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useDarkMode, ThemePreference } from '@/lib/features/darkMode';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function DarkModeToggle({ variant = 'icon', className }: DarkModeToggleProps) {
  const { isDark, preference, setPreference, toggle } = useDarkMode();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggle}
        className={cn(
          'p-2 rounded-lg transition-colors',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          className
        )}
        aria-label={isDark ? 'Schakel naar licht modus' : 'Schakel naar donker modus'}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Weergave
      </h3>
      <div className="flex gap-2">
        <ThemeOption
          value="light"
          current={preference}
          onSelect={setPreference}
          icon={Sun}
          label="Licht"
        />
        <ThemeOption
          value="dark"
          current={preference}
          onSelect={setPreference}
          icon={Moon}
          label="Donker"
        />
        <ThemeOption
          value="system"
          current={preference}
          onSelect={setPreference}
          icon={Monitor}
          label="Systeem"
        />
      </div>
    </div>
  );
}

interface ThemeOptionProps {
  value: ThemePreference;
  current: ThemePreference;
  onSelect: (value: ThemePreference) => void;
  icon: React.ElementType;
  label: string;
}

function ThemeOption({ value, current, onSelect, icon: Icon, label }: ThemeOptionProps) {
  const isActive = current === value;

  return (
    <button
      onClick={() => onSelect(value)}
      className={cn(
        'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
        isActive
          ? 'border-[#4A90A4] bg-[#4A90A4]/10 dark:bg-[#4A90A4]/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      )}
    >
      <Icon
        className={cn(
          'w-5 h-5',
          isActive
            ? 'text-[#4A90A4]'
            : 'text-gray-500 dark:text-gray-400'
        )}
      />
      <span
        className={cn(
          'text-xs',
          isActive
            ? 'text-[#4A90A4] font-medium'
            : 'text-gray-600 dark:text-gray-400'
        )}
      >
        {label}
      </span>
    </button>
  );
}
