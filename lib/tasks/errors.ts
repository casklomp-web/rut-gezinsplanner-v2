'use client';

import { toast } from '@/components/ui/Toast';

// Error types
export class TaskError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'TaskError';
  }
}

// Error messages in Dutch
const errorMessages: Record<string, string> = {
  TASK_NOT_FOUND: 'Taak niet gevonden',
  INVALID_TITLE: 'Titel is verplicht',
  INVALID_ASSIGNEE: 'Selecteer een gezinslid',
  SAVE_FAILED: 'Opslaan mislukt. Probeer opnieuw.',
  DELETE_FAILED: 'Verwijderen mislukt. Probeer opnieuw.',
  NETWORK_ERROR: 'Verbindingsprobleem. Controleer je internet.',
  UNKNOWN_ERROR: 'Er is iets misgegaan. Probeer opnieuw.',
};

// Error handler with toast notifications
export function handleTaskError(error: unknown): void {
  if (error instanceof TaskError) {
    toast.error(errorMessages[error.code] || error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message || errorMessages.UNKNOWN_ERROR);
    return;
  }

  toast.error(errorMessages.UNKNOWN_ERROR);
}

// Success notifications
export function notifyTaskCreated(title: string): void {
  toast.success(`Taak "${title}" aangemaakt`);
}

export function notifyTaskUpdated(title: string): void {
  toast.success(`Taak "${title}" bijgewerkt`);
}

export function notifyTaskDeleted(title: string): void {
  toast.success(`Taak "${title}" verwijderd`);
}

export function notifyTaskCompleted(title: string): void {
  toast.success(`Taak "${title}" afgerond! 🎉`);
}

export function notifyTaskReopened(title: string): void {
  toast.info(`Taak "${title}" heropend`);
}

export function notifyTaskArchived(title: string): void {
  toast.info(`Taak "${title}" gearchiveerd`);
}

// Validation
export function validateTask(title: string, assignedTo: string): TaskError | null {
  if (!title.trim()) {
    return new TaskError(errorMessages.INVALID_TITLE, 'INVALID_TITLE');
  }
  if (!assignedTo) {
    return new TaskError(errorMessages.INVALID_ASSIGNEE, 'INVALID_ASSIGNEE');
  }
  return null;
}

// Wrap async actions with error handling
export async function withErrorHandling<T>(
  action: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await action();
  } catch (error) {
    handleTaskError(error);
    if (errorMessage) {
      toast.error(errorMessage);
    }
    return null;
  }
}
