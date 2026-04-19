'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Task, HouseholdMember, mockTasks, mockHouseholdMembers, getWeekDates, dayNames, fullDayNames } from '@/lib/task-domain'
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

  const dayTasks = tasks.filter(task => task.dueDate === date)

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
        {member.displayName.charAt(0)}
      </div>
      <div>
        <p className="font-semibold">{member.displayName}</p>
        <p className="text-xs text-muted-foreground">
          {member.role === 'admin' ? 'Beheerder' : 'Lid'}
        </p>
      </div>
    </div>
  )
}

// Main Task Board Component
export function FamilyTaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const weekDates = getWeekDates()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const dropZone = over.id as string
    const [date, memberId] = dropZone.split('-')

    // Update task
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, dueDate: date, assigneeId: memberId }
          : task
      )
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
              {mockHouseholdMembers.map(member => (
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
              member={mockHouseholdMembers.find(m => m.id === activeTask.assigneeId)!}
              isOverlay
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}