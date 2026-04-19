'use client';

import { useState } from 'react';
import { Repeat, Calendar, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecurrenceType } from '@/lib/types/task';

interface RecurrenceSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
  endDate?: string;
  onEndDateChange: (date: string) => void;
  interval?: number;
  onIntervalChange?: (interval: number) => void;
  compact?: boolean;
}

const recurrenceOptions: { 
  value: RecurrenceType; 
  label: string; 
  description: string;
  icon: string;
}[] = [
  { 
    value: 'none', 
    label: 'Eenmalig', 
    description: 'Deze taak wordt één keer uitgevoerd',
    icon: '1️⃣'
  },
  { 
    value: 'daily', 
    label: 'Dagelijks', 
    description: 'Herhaal elke dag',
    icon: '📅'
  },
  { 
    value: 'weekly', 
    label: 'Wekelijks', 
    description: 'Herhaal elke week op dezelfde dag',
    icon: '📆'
  },
  { 
    value: 'monthly', 
    label: 'Maandelijks', 
    description: 'Herhaal elke maand op dezelfde datum',
    icon: '🗓️'
  },
];

export function RecurrenceSelector({
  value,
  onChange,
  endDate,
  onEndDateChange,
  interval = 1,
  onIntervalChange,
  compact = false,
}: RecurrenceSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(value !== 'none');

  const selectedOption = recurrenceOptions.find((opt) => opt.value === value);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {value !== 'none' && (
          <>
            <span className="inline-flex items-center gap-1 text-xs text-[#4A90A4] bg-[#4A90A4]/10 px-2 py-1 rounded-full">
              <Repeat className="w-3 h-3" />
              {selectedOption?.label}
            </span>
            {endDate && (
              <span className="text-xs text-gray-500">
                tot {new Date(endDate).toLocaleDateString('nl-NL')}
              </span>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Repeat className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Herhaling
        </span>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-2">
        {recurrenceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value);
              setIsExpanded(option.value !== 'none');
            }}
            className={cn(
              'flex items-start gap-2 p-3 rounded-xl border-2 text-left transition-all',
              value === option.value
                ? 'border-[#4A90A4] bg-[#4A90A4]/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            )}
          >
            <span className="text-lg">{option.icon}</span>
            <div>
              <p className={cn(
                'text-sm font-medium',
                value === option.value ? 'text-[#4A90A4]' : 'text-gray-700 dark:text-gray-300'
              )}>
                {option.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Extended Options */}
      {value !== 'none' && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-3">
          {/* Interval */}
          {onIntervalChange && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                Elke {interval === 1 ? '' : interval + ' '}{value === 'daily' ? 'dag' : value === 'weekly' ? 'weken' : 'maanden'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={interval}
                  onChange={(e) => onIntervalChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4A90A4]"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-6">
                  {interval}
                </span>
              </div>
            </div>
          )}

          {/* End Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Einddatum (optioneel)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm"
              />
              {endDate && (
                <button
                  type="button"
                  onClick={() => onEndDateChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Laat leeg om oneindig te herhalen
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact badge for task card
export function RecurrenceBadge({ 
  type, 
  endDate,
  className 
}: { 
  type: RecurrenceType; 
  endDate?: string;
  className?: string;
}) {
  if (type === 'none') return null;

  const labels: Record<RecurrenceType, string> = {
    none: '',
    daily: 'Dagelijks',
    weekly: 'Wekelijks',
    monthly: 'Maandelijks',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium text-[#4A90A4] bg-[#4A90A4]/10 px-2 py-0.5 rounded-full',
      className
    )}>
      <Repeat className="w-3 h-3" />
      {labels[type]}
      {endDate && (
        <span className="text-[#4A90A4]/70">
          tot {new Date(endDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
        </span>
      )}
    </span>
  );
}
