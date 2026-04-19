import { FamilyTaskBoard } from '@/components/tasks/family-task-board'
import { AppShell } from '@/components/navigation/app-shell'

export default function TasksPage() {
  return (
    <AppShell>
      <div className="h-[calc(100vh-4rem)]">
        <FamilyTaskBoard />
      </div>
    </AppShell>
  )
}