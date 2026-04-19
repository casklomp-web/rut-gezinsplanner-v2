/**
 * Task types for Rut App
 * Gezinsplanner voor vetverlies - Autismevriendelijk
 */

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface TaskReminder {
  enabled: boolean;
  time: string; // HH:mm format
  daysBefore?: number;
}

export interface TaskNotificationPrefs {
  push: boolean;
  telegram: boolean;
  email: boolean;
}

export interface TaskCompletion {
  id: string;
  completedAt: Date;
  completedBy: string; // user id
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  
  // Assignment
  assignedTo: string; // family member id
  assignedBy: string; // user id who created/assigned
  
  // Dates
  dueDate?: string; // ISO date string
  createdAt: Date;
  updatedAt: Date;
  
  // Recurrence
  recurrence: {
    type: RecurrenceType;
    endDate?: string; // ISO date string
    interval?: number; // every N days/weeks/months
  };
  parentTaskId?: string; // for recurring task instances
  
  // Reminders
  reminder?: TaskReminder;
  notifications: TaskNotificationPrefs;
  
  // History
  completions: TaskCompletion[];
  
  // Metadata
  category?: string;
  tags: string[];
  isArchived: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  role: "parent" | "child" | "other";
}

// Task filters
export interface TaskFilters {
  status?: TaskStatus[];
  assignedTo?: string[];
  priority?: TaskPriority[];
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
  category?: string[];
}

// Task stats
export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  dueToday: number;
  byAssignee: Record<string, number>;
}
