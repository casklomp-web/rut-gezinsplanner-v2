/**
 * Collaborative Editing Utilities
 * Feature 10: Real-time sync, conflict resolution, activity log
 */

import { Week, Day, MealInstance, User } from '@/lib/types';

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'complete' | 'swap' | 'generate';
  targetType: 'week' | 'day' | 'meal' | 'shopping' | 'recipe';
  targetId: string;
  targetName: string;
  details: Record<string, unknown>;
  timestamp: string;
  weekId: string;
}

export interface Conflict {
  id: string;
  weekId: string;
  dayId?: string;
  field: string;
  localValue: unknown;
  remoteValue: unknown;
  localTimestamp: string;
  remoteTimestamp: string;
  localUserId: string;
  remoteUserId: string;
  resolved: boolean;
  resolution?: 'local' | 'remote' | 'merged';
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface HouseholdMember {
  userId: string;
  name: string;
  role: 'admin' | 'member';
  joinedAt: string;
  lastSeen: string;
  isOnline: boolean;
}

export interface SyncState {
  isConnected: boolean;
  isSyncing: boolean;
  lastSyncAt: string | null;
  pendingChanges: number;
  conflicts: Conflict[];
}

// Activity Log Functions
export function createActivityLogEntry(
  user: User,
  action: ActivityLogEntry['action'],
  targetType: ActivityLogEntry['targetType'],
  targetId: string,
  targetName: string,
  details: Record<string, unknown> = {},
  weekId: string
): ActivityLogEntry {
  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: user.id,
    userName: user.name,
    action,
    targetType,
    targetId,
    targetName,
    details,
    timestamp: new Date().toISOString(),
    weekId,
  };
}

export function getActivityLog(weekId: string): ActivityLogEntry[] {
  if (typeof window === 'undefined') return [];
  const key = `rut-activity-log-${weekId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

export function addActivityLogEntry(entry: ActivityLogEntry): void {
  if (typeof window === 'undefined') return;
  const key = `rut-activity-log-${entry.weekId}`;
  const existing = getActivityLog(entry.weekId);
  const updated = [entry, ...existing].slice(0, 100); // Keep last 100 entries
  localStorage.setItem(key, JSON.stringify(updated));
}

// Conflict Detection
export function detectConflicts(
  localWeek: Week,
  remoteWeek: Week,
  localUserId: string,
  remoteUserId: string
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Check each day for conflicts
  localWeek.days.forEach(localDay => {
    const remoteDay = remoteWeek.days.find(d => d.id === localDay.id);
    if (!remoteDay) return;

    // Check meals
    (['breakfast', 'lunch', 'dinner'] as const).forEach(mealType => {
      const localMeal = localDay.meals[mealType];
      const remoteMeal = remoteDay.meals[mealType];

      if (localMeal.mealId !== remoteMeal.mealId) {
        conflicts.push({
          id: `conflict_${localDay.id}_${mealType}`,
          weekId: localWeek.id,
          dayId: localDay.id,
          field: `meals.${mealType}`,
          localValue: localMeal.mealId,
          remoteValue: remoteMeal.mealId,
          localTimestamp: localWeek.updatedAt.toString(),
          remoteTimestamp: remoteWeek.updatedAt.toString(),
          localUserId,
          remoteUserId,
          resolved: false,
        });
      }

      // Check completion status
      if (localMeal.completed !== remoteMeal.completed) {
        conflicts.push({
          id: `conflict_${localDay.id}_${mealType}_completed`,
          weekId: localWeek.id,
          dayId: localDay.id,
          field: `meals.${mealType}.completed`,
          localValue: localMeal.completed,
          remoteValue: remoteMeal.completed,
          localTimestamp: localWeek.updatedAt.toString(),
          remoteTimestamp: remoteWeek.updatedAt.toString(),
          localUserId,
          remoteUserId,
          resolved: false,
        });
      }
    });

    // Check checkins
    Object.entries(localDay.checkins).forEach(([key, localValue]) => {
      const remoteValue = remoteDay.checkins[key as keyof typeof remoteDay.checkins];
      if (localValue !== remoteValue) {
        conflicts.push({
          id: `conflict_${localDay.id}_checkin_${key}`,
          weekId: localWeek.id,
          dayId: localDay.id,
          field: `checkins.${key}`,
          localValue,
          remoteValue,
          localTimestamp: localWeek.updatedAt.toString(),
          remoteTimestamp: remoteWeek.updatedAt.toString(),
          localUserId,
          remoteUserId,
          resolved: false,
        });
      }
    });
  });

  return conflicts;
}

// Conflict Resolution
export function resolveConflict(
  conflict: Conflict,
  resolution: 'local' | 'remote' | 'merged',
  mergedValue?: unknown
): Conflict {
  return {
    ...conflict,
    resolved: true,
    resolution,
    localValue: resolution === 'merged' ? mergedValue : conflict.localValue,
    remoteValue: resolution === 'merged' ? mergedValue : conflict.remoteValue,
  };
}

export function applyConflictResolution(
  week: Week,
  conflict: Conflict,
  resolution: 'local' | 'remote' | 'merged',
  mergedValue?: unknown
): Week {
  const value = resolution === 'local' ? conflict.localValue :
                resolution === 'remote' ? conflict.remoteValue :
                mergedValue;

  if (!conflict.dayId) return week;

  return {
    ...week,
    days: week.days.map(day => {
      if (day.id !== conflict.dayId) return day;

      const fieldParts = conflict.field.split('.');
      if (fieldParts.length === 2 && fieldParts[0] === 'meals') {
        const mealType = fieldParts[1] as 'breakfast' | 'lunch' | 'dinner';
        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: {
              ...day.meals[mealType],
              mealId: value as string,
            },
          },
        };
      }

      if (fieldParts.length === 3 && fieldParts[0] === 'meals' && fieldParts[2] === 'completed') {
        const mealType = fieldParts[1] as 'breakfast' | 'lunch' | 'dinner';
        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: {
              ...day.meals[mealType],
              completed: value as boolean,
            },
          },
        };
      }

      if (fieldParts[0] === 'checkins') {
        const checkinKey = fieldParts[1] as keyof typeof day.checkins;
        return {
          ...day,
          checkins: {
            ...day.checkins,
            [checkinKey]: value as boolean,
          },
        };
      }

      return day;
    }),
  };
}

// Household Management
const HOUSEHOLD_KEY = 'rut-household';

export function getHousehold(): Household | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(HOUSEHOLD_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function setHousehold(household: Household): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(household));
}

export function createHousehold(name: string, adminUser: User): Household {
  const household: Household = {
    id: `household_${Date.now()}`,
    name,
    members: [{
      userId: adminUser.id,
      name: adminUser.name,
      role: 'admin',
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isOnline: true,
    }],
    inviteCode: generateInviteCode(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  setHousehold(household);
  return household;
}

export function joinHousehold(household: Household, user: User): Household {
  const updated: Household = {
    ...household,
    members: [
      ...household.members,
      {
        userId: user.id,
        name: user.name,
        role: 'member',
        joinedAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        isOnline: true,
      },
    ],
    updatedAt: new Date().toISOString(),
  };
  setHousehold(updated);
  return updated;
}

export function leaveHousehold(household: Household, userId: string): Household | null {
  const updatedMembers = household.members.filter(m => m.userId !== userId);
  if (updatedMembers.length === 0) {
    // Last member leaving - delete household
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HOUSEHOLD_KEY);
    }
    return null;
  }
  
  const updated: Household = {
    ...household,
    members: updatedMembers,
    updatedAt: new Date().toISOString(),
  };
  setHousehold(updated);
  return updated;
}

export function updateMemberOnlineStatus(
  household: Household,
  userId: string,
  isOnline: boolean
): Household {
  const updated: Household = {
    ...household,
    members: household.members.map(m =>
      m.userId === userId
        ? { ...m, isOnline, lastSeen: new Date().toISOString() }
        : m
    ),
  };
  setHousehold(updated);
  return updated;
}

function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Simulated real-time sync (in production, this would use WebSockets)
export function simulateSync(
  localWeek: Week,
  onUpdate: (week: Week, conflicts: Conflict[]) => void
): () => void {
  // Simulate periodic sync
  const interval = setInterval(() => {
    // In production, this would fetch from server
    // For now, just trigger the callback
    onUpdate(localWeek, []);
  }, 30000); // Every 30 seconds

  return () => clearInterval(interval);
}

// Format activity log entry for display
export function formatActivityLogEntry(entry: ActivityLogEntry): string {
  const actionLabels: Record<string, string> = {
    create: 'aangemaakt',
    update: 'bijgewerkt',
    delete: 'verwijderd',
    complete: 'afgevinkt',
    swap: 'gewisseld',
    generate: 'gegenereerd',
  };

  const targetLabels: Record<string, string> = {
    week: 'week',
    day: 'dag',
    meal: 'maaltijd',
    shopping: 'boodschappenlijst',
    recipe: 'recept',
  };

  const time = new Date(entry.timestamp).toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${time} - ${entry.userName} heeft ${targetLabels[entry.targetType]} "${entry.targetName}" ${actionLabels[entry.action]}`;
}
