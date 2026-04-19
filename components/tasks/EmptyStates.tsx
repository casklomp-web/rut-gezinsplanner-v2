'use client';

import { ReactNode } from 'react';
import { ClipboardList, Search, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: typeof ClipboardList;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export function EmptyState({
  icon: Icon = ClipboardList,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  if (variant === 'inline') {
    return (
      <div className={cn('text-center py-8', className)}>
        <Icon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-gray-500 font-medium">{title}</p>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('text-center py-6 px-4', className)}>
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
        {action && <div className="mt-3">{action}</div>}
      </div>
    );
  }

  return (
    <div className={cn('text-center py-12 px-4', className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#4A90A4]/10 to-[#7CB342]/10 flex items-center justify-center">
        <Icon className="w-8 h-8 text-[#4A90A4]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-4">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Specialized empty states

export function NoTasksEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Nog geen taken"
      description="Maak je eerste taak om te beginnen met het organiseren van je gezin"
      action={
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Eerste taak maken
        </Button>
      }
    />
  );
}

export function NoSearchResultsEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="Geen resultaten"
      description="Geen taken gevonden die overeenkomen met je zoekopdracht"
      variant="compact"
      action={
        <Button variant="outline" size="sm" onClick={onClear}>
          Zoekopdracht wissen
        </Button>
      }
    />
  );
}

export function AllTasksCompletedEmptyState() {
  return (
    <EmptyState
      icon={CheckCircle2}
      title="Alles af!"
      description="Geweldig werk! Alle taken zijn voltooid. Tijd om te ontspannen."
      variant="compact"
    />
  );
}

export function NoOverdueTasksEmptyState() {
  return (
    <EmptyState
      icon={CheckCircle2}
      title="Geen achterstallige taken"
      description="Je bent helemaal bij! Geen taken die over de deadline zijn."
      variant="compact"
    />
  );
}

export function ErrorEmptyState({ 
  onRetry, 
  message = "Er is iets misgegaan" 
}: { 
  onRetry: () => void; 
  message?: string;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={message}
      description="Probeer het opnieuw of neem contact op als het probleem aanhoudt"
      action={
        <Button onClick={onRetry} variant="outline">
          Opnieuw proberen
        </Button>
      }
    />
  );
}
