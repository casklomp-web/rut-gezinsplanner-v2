// Domain model for Rut - Family Task Board
// This file defines the core data structures

export interface Household {
  id: string
  name: string
  created_by: string
  created_at: string
}

export interface HouseholdMember {
  id: string
  household_id: string
  user_id: string
  display_name: string
  role: 'admin' | 'member'
  color: string // For UI lane coloring
  avatar?: string
  created_at: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskRecurrence = 'none' | 'daily' | 'weekly'
export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Task {
  id: string
  household_id: string
  created_by: string
  assignee_id: string
  title: string
  description?: string
  due_date: string // ISO date string
  status: TaskStatus
  recurrence: TaskRecurrence
  recurrence_end_date?: string
  
  // Integration with food
  is_meal: boolean
  meal_type?: MealType
  recipe_id?: string // Link to recipes table
  
  // Metadata
  created_at: string
  updated_at: string
}

export interface TaskCompletion {
  id: string
  task_id: string
  completed_by: string
  completed_at: string
  week_number: number
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
    household_id: 'household-1',
    user_id: 'user-1',
    display_name: 'Papa',
    role: 'admin',
    color: '#3b82f6', // blue
    created_at: '2025-01-01',
  },
  {
    id: 'member-2',
    household_id: 'household-1',
    user_id: 'user-2',
    display_name: 'Mama',
    role: 'admin',
    color: '#ec4899', // pink
    created_at: '2025-01-01',
  },
  {
    id: 'member-3',
    household_id: 'household-1',
    user_id: 'user-3',
    display_name: 'Emma',
    role: 'member',
    color: '#f59e0b', // amber
    created_at: '2025-01-01',
  },
  {
    id: 'member-4',
    household_id: 'household-1',
    user_id: 'user-4',
    display_name: 'Lucas',
    role: 'member',
    color: '#10b981', // emerald
    created_at: '2025-01-01',
  },
]

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    household_id: 'household-1',
    created_by: 'user-1',
    assignee_id: 'member-1',
    title: 'Afval buiten zetten',
    description: 'Grijze container aan de straat',
    due_date: '2025-04-21', // Monday
    status: 'todo',
    recurrence: 'weekly',
    is_meal: false,
    created_at: '2025-04-19',
    updated_at: '2025-04-19',
  },
  {
    id: 'task-2',
    household_id: 'household-1',
    created_by: 'user-2',
    assignee_id: 'member-2',
    title: 'Keuken opruimen',
    due_date: '2025-04-21',
    status: 'todo',
    recurrence: 'daily',
    is_meal: false,
    created_at: '2025-04-19',
    updated_at: '2025-04-19',
  },
  {
    id: 'task-3',
    household_id: 'household-1',
    created_by: 'user-1',
    assignee_id: 'member-3',
    title: 'Huiswerk maken',
    due_date: '2025-04-21',
    status: 'todo',
    recurrence: 'daily',
    is_meal: false,
    created_at: '2025-04-19',
    updated_at: '2025-04-19',
  },
  {
    id: 'task-4',
    household_id: 'household-1',
    created_by: 'user-2',
    assignee_id: 'member-4',
    title: 'Tanden poetsen',
    due_date: '2025-04-21',
    status: 'todo',
    recurrence: 'daily',
    is_meal: false,
    created_at: '2025-04-19',
    updated_at: '2025-04-19',
  },
  {
    id: 'task-5',
    household_id: 'household-1',
    created_by: 'user-1',
    assignee_id: 'member-1',
    title: 'Boodschappen doen',
    due_date: '2025-04-22', // Tuesday
    status: 'todo',
    recurrence: 'weekly',
    is_meal: false,
    created_at: '2025-04-19',
    updated_at: '2025-04-19',
  },
  {
    id: 'task-6',
    household_id: 'household-1',
    created_by: 'user-2',
    assignee_id: 'member-2',
    title: 'Wasmachine aanzetten',
    due_date: '2025-04-23', // Wednesday
    status: 'todo',
    recurrence: 'weekly',
    is_meal: false,
    created_at: '2025-04-19',
    updated_at: '2025-04-19',
  },
]

// Helper functions
export function getTasksForMember(tasks: Task[], memberId: string): Task[] {
  return tasks.filter(task => task.assignee_id === memberId)
}

export function getTasksForDate(tasks: Task[], date: string): Task[] {
  return tasks.filter(task => task.due_date === date)
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