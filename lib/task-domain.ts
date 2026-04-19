// Domain model for Rut - Family Task Board
// This file defines the core data structures

export interface Household {
  id: string
  name: string
  createdBy: string
  createdAt: string
}

export interface HouseholdMember {
  id: string
  householdId: string
  userId: string
  displayName: string
  role: 'admin' | 'member'
  color: string // For UI lane coloring
  avatar?: string
  createdAt: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskRecurrence = 'none' | 'daily' | 'weekly'
export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Task {
  id: string
  householdId: string
  createdBy: string
  assigneeId: string
  title: string
  description?: string
  dueDate: string // ISO date string
  status: TaskStatus
  recurrence: TaskRecurrence
  recurrenceEndDate?: string
  
  // Integration with food
  isMeal: boolean
  mealType?: MealType
  recipeId?: string // Link to recipes table
  
  // Metadata
  createdAt: string
  updatedAt: string
}

export interface TaskCompletion {
  id: string
  taskId: string
  completedBy: string
  completedAt: string
  weekNumber: number
}

// For the task board view
export interface TaskBoardLane {
  member: HouseholdMember
  tasks: Task[]
}

export interface DayColumn {
  date: string
  dayName: string
  lanes: TaskBoardLane[]
}

// Mock data for development
export const mockHouseholdMembers: HouseholdMember[] = [
  {
    id: 'member-1',
    householdId: 'household-1',
    userId: 'user-1',
    displayName: 'Papa',
    role: 'admin',
    color: '#3b82f6', // blue
    createdAt: '2025-01-01',
  },
  {
    id: 'member-2',
    householdId: 'household-1',
    userId: 'user-2',
    displayName: 'Mama',
    role: 'admin',
    color: '#ec4899', // pink
    createdAt: '2025-01-01',
  },
  {
    id: 'member-3',
    householdId: 'household-1',
    userId: 'user-3',
    displayName: 'Emma',
    role: 'member',
    color: '#f59e0b', // amber
    createdAt: '2025-01-01',
  },
  {
    id: 'member-4',
    householdId: 'household-1',
    userId: 'user-4',
    displayName: 'Lucas',
    role: 'member',
    color: '#10b981', // emerald
    createdAt: '2025-01-01',
  },
]

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    householdId: 'household-1',
    createdBy: 'user-1',
    assigneeId: 'member-1',
    title: 'Afval buiten zetten',
    description: 'Grijze container aan de straat',
    dueDate: '2025-04-21', // Monday
    status: 'todo',
    recurrence: 'weekly',
    isMeal: false,
    createdAt: '2025-04-19',
    updatedAt: '2025-04-19',
  },
  {
    id: 'task-2',
    householdId: 'household-1',
    createdBy: 'user-2',
    assigneeId: 'member-2',
    title: 'Keuken opruimen',
    dueDate: '2025-04-21',
    status: 'todo',
    recurrence: 'daily',
    isMeal: false,
    createdAt: '2025-04-19',
    updatedAt: '2025-04-19',
  },
  {
    id: 'task-3',
    householdId: 'household-1',
    createdBy: 'user-1',
    assigneeId: 'member-3',
    title: 'Huiswerk maken',
    dueDate: '2025-04-21',
    status: 'todo',
    recurrence: 'daily',
    isMeal: false,
    createdAt: '2025-04-19',
    updatedAt: '2025-04-19',
  },
  {
    id: 'task-4',
    householdId: 'household-1',
    createdBy: 'user-2',
    assigneeId: 'member-4',
    title: 'Tanden poetsen',
    dueDate: '2025-04-21',
    status: 'todo',
    recurrence: 'daily',
    isMeal: false,
    createdAt: '2025-04-19',
    updatedAt: '2025-04-19',
  },
  {
    id: 'task-5',
    householdId: 'household-1',
    createdBy: 'user-1',
    assigneeId: 'member-1',
    title: 'Boodschappen doen',
    dueDate: '2025-04-22', // Tuesday
    status: 'todo',
    recurrence: 'weekly',
    isMeal: false,
    createdAt: '2025-04-19',
    updatedAt: '2025-04-19',
  },
  {
    id: 'task-6',
    householdId: 'household-1',
    createdBy: 'user-2',
    assigneeId: 'member-2',
    title: 'Wasmachine aanzetten',
    dueDate: '2025-04-23', // Wednesday
    status: 'todo',
    recurrence: 'weekly',
    isMeal: false,
    createdAt: '2025-04-19',
    updatedAt: '2025-04-19',
  },
]

// Helper functions
export function getTasksForMember(tasks: Task[], memberId: string): Task[] {
  return tasks.filter(task => task.assigneeId === memberId)
}

export function getTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter(task => task.dueDate === date)
}

export function getWeekDates(startDate: Date = new Date()): string[] {
  const dates: string[] = []
  const curr = new Date(startDate)
  
  // Get Monday of current week
  const day = curr.getDay()
  const diff = curr.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(curr.setDate(diff))
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

export const dayNames = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
export const fullDayNames = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']