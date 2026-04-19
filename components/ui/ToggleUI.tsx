'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function ToggleUI({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label className={cn(
      "flex items-center justify-between cursor-pointer",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      <div className="flex-1">
        {label && <span className="text-sm font-medium text-[#2D3436]">{label}</span>}
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90A4] focus:ring-offset-2",
          checked ? "bg-[#4A90A4]" : "bg-gray-300",
          disabled && "cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}
