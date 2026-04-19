'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Task, HouseholdMember, mockHouseholdMembers, mockTasks, getWeekDates, dayNames, fullDayNames } from '@/lib/task-domain'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, CheckCircle2, Circle, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'

// Draggable Task Card
interface TaskCardProps {
  task: Task
  member: HouseholdMember
  isOverlay?: boolean
}

function TaskCard({ task, member, isOverlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, member },
  })

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        'p-3 cursor-grab active:cursor-grabbing transition-all',
        isDragging && 'opacity-50 rotate-2',
        isOverlay && 'shadow-xl rotate-2 scale-105 cursor-grabbing',
        'hover:shadow-md border-l-4'
      )}
      // Border color based on member
      // @ts-ignore - dynamic style
      sx={{ borderLeftColor: member.color }}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">
          {task.status === 'done' ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-tight">{task.title}</p>
          {task.recurrence !== 'none' && (
            <div className="flex items-center gap-1 mt-1">
              <Repeat className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {task.recurrence === 'daily' ? 'Dagelijks' : 'Wekelijks'}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

// Droppable Lane
interface TaskLaneProps {
  member: HouseholdMember
  tasks: Task[]
  date: string
}

function TaskLane({ member, tasks, date }: TaskLaneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${date}-${member.id}`,
    data: { date, member },
  })

  const dayTasks = tasks.filter(task => task.due_date === date)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[100px] p-2 rounded-lg transition-colors',
        isOver && 'bg-primary/10 ring-2 ring-primary/30'
      )}
      style={{ backgroundColor: isOver ? undefined : `${member.color}08` }}
    >
      <div className="space-y-2">
        {dayTasks.map(task => (
          <TaskCard key={task.id} task={task} member={member} />
        ))}
        {dayTasks.length === 0 && (
          <div className="h-8 flex items-center justify-center text-xs text-muted-foreground/50">
            Sleep taak hierheen
          </div>
        )}
      </div>
    </div>
  )
}

// Member Header
interface MemberHeaderProps {
  member: HouseholdMember
}

function MemberHeader({ member }: MemberHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-3 sticky left-0 bg-background z-10">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: member.color }}
      >
        {member.display_name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold">{member.display_name}</p>
        <p className="text-xs text-muted-foreground">
          {member.role === 'admin' ? 'Beheerder' : 'Lid'}
        </p>
      </div>
    </div>
  )
}

// Main Task Board Component
export function FamilyTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<HouseholdMember[]>(mockHouseholdMembers)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const weekDates = getWeekDates()

  // Load tasks from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
          console.log('Supabase not configured, using mock data')
          setTasks(mockTasks)
          setLoading(false)
          return
        }
        
        // Dynamic import to avoid build-time errors
        const { getTasks, getHouseholdMembers } = await import('@/lib/task-api')
        
        // TODO: Get actual household ID from auth context
        const householdId = 'household-1'
        const startDate = weekDates[0]
        const endDate = weekDates[6]
        
        const [loadedTasks, loadedMembers] = await Promise.all([
          getTasks(householdId, startDate, endDate),
          getHouseholdMembers(householdId),
        ])
        
        setTasks(loadedTasks)
        if (loadedMembers.length > 0) {
          setMembers(loadedMembers)
        }
      } catch (error) {
        console.error('Failed to load tasks:', error)
        // Fall back to mock data
        setTasks(mockTasks)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const dropZone = over.id as string
    const [date, memberId] = dropZone.split('-')

    // Optimistically update UI
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, due_date: date, assignee_id: memberId }
          : task
      )
    )

    // Update in database (only if Supabase is configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { updateTask } = await import('@/lib/task-api')
        await updateTask(taskId, { due_date: date, assignee_id: memberId })
      } catch (error) {
        console.error('Failed to update task:', error)
        // TODO: Revert optimistic update on error
      }
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold font-serif">Familie Takenbord</h1>
          <p className="text-muted-foreground text-sm">
            Sleep taken om ze te verdelen
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nieuwe taak
        </Button>
      </div>

      {/* Board */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-auto">
          <div className="min-w-[800px] p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
              <div className="sticky left-0 bg-background z-10 p-3">
                <span className="text-sm font-medium text-muted-foreground">Gezinslid</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, index) => (
                  <div key={date} className="text-center p-2">
                    <p className="text-sm font-medium">{dayNames[index]}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(date).getDate()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Lanes */}
            <div className="space-y-4">
              {members.map(member => (
                <div
                  key={member.id}
                  className="grid grid-cols-[200px_1fr] gap-4 items-start"
                >
                  <MemberHeader member={member} />
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map(date => (
                      <TaskLane
                        key={`${date}-${member.id}`}
                        member={member}
                        tasks={tasks}
                        date={date}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard
              task={activeTask}
              member={members.find(m => m.id === activeTask.assignee_id)!}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}