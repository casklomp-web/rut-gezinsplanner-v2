import { createClient } from '@/lib/supabase-client'
import type { Task, HouseholdMember, TaskCompletion } from '@/lib/task-domain'

const supabase = createClient()

// Household Members
export async function getHouseholdMembers(householdId: string): Promise<HouseholdMember[]> {
  const { data, error } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createHouseholdMember(
  member: Omit<HouseholdMember, 'id' | 'created_at'>
): Promise<HouseholdMember> {
  const { data, error } = await supabase
    .from('household_members')
    .insert(member)
    .select()
    .single()

  if (error) throw error
  return data
}

// Tasks
export async function getTasks(householdId: string, startDate?: string, endDate?: string): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('household_id', householdId)

  if (startDate) {
    query = query.gte('due_date', startDate)
  }
  if (endDate) {
    query = query.lte('due_date', endDate)
  }

  const { data, error } = await query.order('due_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getTasksForDate(householdId: string, date: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('household_id', householdId)
    .eq('due_date', date)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTask(
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (error) throw error
}

// Task Completions
export async function completeTask(
  taskId: string,
  completedBy: string,
  weekNumber: number
): Promise<TaskCompletion> {
  const { data, error } = await supabase
    .from('task_completions')
    .insert({
      task_id: taskId,
      completed_by: completedBy,
      week_number: weekNumber,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getTaskCompletions(householdId: string, weekNumber?: number): Promise<TaskCompletion[]> {
  // First get task IDs for this household
  const { data: taskIds } = await supabase
    .from('tasks')
    .select('id')
    .eq('household_id', householdId)
  
  if (!taskIds || taskIds.length === 0) return []
  
  const ids = taskIds.map(t => t.id)
  
  let query = supabase
    .from('task_completions')
    .select('*')
    .in('task_id', ids)

  if (weekNumber) {
    query = query.eq('week_number', weekNumber)
  }

  const { data, error } = await query.order('completed_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Recurrence helper - Generate recurring tasks
export async function generateRecurringTasks(householdId: string, forDate: string): Promise<void> {
  // Get all recurring tasks that should exist for this date
  const { data: recurringTasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('household_id', householdId)
    .neq('recurrence', 'none')
    .or(`recurrence_end_date.is.null,recurrence_end_date.gte.${forDate}`)

  if (error) throw error
  if (!recurringTasks) return

  // For each recurring task, check if it should generate a new instance
  for (const task of recurringTasks) {
    const shouldGenerate = checkShouldGenerateRecurring(task, forDate)
    
    if (shouldGenerate) {
      // Check if task already exists for this date
      const { data: existing } = await supabase
        .from('tasks')
        .select('id')
        .eq('household_id', householdId)
        .eq('assignee_id', task.assignee_id)
        .eq('title', task.title)
        .eq('due_date', forDate)
        .single()

      if (!existing) {
        // Create new instance
        await supabase.from('tasks').insert({
          household_id: task.household_id,
          created_by: task.created_by,
          assignee_id: task.assignee_id,
          title: task.title,
          description: task.description,
          due_date: forDate,
          status: 'todo',
          recurrence: 'none', // Generated instances don't recur
          is_meal: task.is_meal,
          meal_type: task.meal_type,
          recipe_id: task.recipe_id,
        })
      }
    }
  }
}

function checkShouldGenerateRecurring(task: Task, forDate: string): boolean {
  const taskDate = new Date(task.due_date)
  const checkDate = new Date(forDate)
  
  // Check if past end date
  if (task.recurrence_end_date && new Date(task.recurrence_end_date) < checkDate) {
    return false
  }

  if (task.recurrence === 'daily') {
    return true
  }

  if (task.recurrence === 'weekly') {
    // Check if same day of week
    return taskDate.getDay() === checkDate.getDay()
  }

  return false
}