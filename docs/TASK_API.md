# Task API Documentation

## Overview
De Task API biedt een complete set van operaties voor takenbeheer. Momenteel gebruikt deze mock data in de browser (Zustand store), maar is ontworpen voor eenvoudige migratie naar Supabase.

## Store API

### useTaskStore

#### State
```typescript
const {
  tasks,           // Task[]
  familyMembers,   // FamilyMember[]
  isLoading,       // boolean
  error,           // string | null
  filters          // TaskFilters
} = useTaskStore();
```

#### Actions

##### createTask
Maak een nieuwe taak aan.

```typescript
const newTask = createTask({
  title: "Boodschappen doen",
  description: "Melk en brood halen",
  assignedTo: "member-id",
  assignedBy: "current-user-id",
  dueDate: "2025-01-20",
  priority: "high",
  status: "todo",
  recurrence: { type: "weekly" },
  reminder: { enabled: true, time: "09:00" },
  notifications: { push: true, telegram: false, email: false },
  tags: ["boodschappen"],
  isArchived: false
});
// Returns: Task
```

##### updateTask
Update een bestaande taak.

```typescript
updateTask("task-id", {
  title: "Nieuwe titel",
  status: "done"
});
```

##### deleteTask
Verwijder een taak permanent.

```typescript
deleteTask("task-id");
```

##### toggleTaskStatus
Wissel tussen todo → in-progress → done.

```typescript
toggleTaskStatus("task-id");
```

##### completeTask
Markeer een taak als voltooid.

```typescript
completeTask("task-id", "Optionele notities", "user-id");
```

##### uncompleteTask
Heropen een voltooide taak.

```typescript
uncompleteTask("task-id");
```

##### archiveTask / unarchiveTask
Archiveer of herstel een taak.

```typescript
archiveTask("task-id");
unarchiveTask("task-id");
```

#### Getters

##### getTaskById
```typescript
const task = getTaskById("task-id");
// Returns: Task | undefined
```

##### getTasksByAssignee
```typescript
const tasks = getTasksByAssignee("member-id");
// Returns: Task[]
```

##### getTasksByStatus
```typescript
const tasks = getTasksByStatus("todo");
// Returns: Task[]
```

##### getOverdueTasks
```typescript
const overdue = getOverdueTasks();
// Returns: Task[]
```

##### getTasksDueToday
```typescript
const today = getTasksDueToday();
// Returns: Task[]
```

##### getFilteredTasks
```typescript
// Gebruikt de huidige filters state
const filtered = getFilteredTasks();
// Returns: Task[]
```

##### getTaskStats
```typescript
const stats = getTaskStats();
// Returns: {
//   total: number;
//   todo: number;
//   inProgress: number;
//   done: number;
//   overdue: number;
//   dueToday: number;
//   byAssignee: Record<string, number>;
// }
```

##### getFamilyMemberById
```typescript
const member = getFamilyMemberById("member-id");
// Returns: FamilyMember | undefined
```

## Filter API

### setFilters
```typescript
setFilters({
  status: ["todo", "in-progress"],
  assignedTo: ["member-1", "member-2"],
  priority: ["high"],
  dueDateFrom: "2025-01-01",
  dueDateTo: "2025-01-31",
  search: "boodschappen",
  category: ["huishouden"]
});
```

### clearFilters
```typescript
clearFilters();
```

## Family Members API

### addFamilyMember
```typescript
addFamilyMember({
  name: "Oma",
  color: "#E17055",
  role: "other"
});
// Returns: FamilyMember with generated id
```

### updateFamilyMember
```typescript
updateFamilyMember("member-id", {
  name: "Nieuwe naam",
  color: "#4A90A4"
});
```

### removeFamilyMember
```typescript
removeFamilyMember("member-id");
// Tasks worden automatisch hertoegewezen
```

## Types

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  assignedBy: string;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
  recurrence: {
    type: "none" | "daily" | "weekly" | "monthly";
    endDate?: string;
    interval?: number;
  };
  parentTaskId?: string;
  reminder?: {
    enabled: boolean;
    time: string;
  };
  notifications: {
    push: boolean;
    telegram: boolean;
    email: boolean;
  };
  completions: TaskCompletion[];
  category?: string;
  tags: string[];
  isArchived: boolean;
}
```

### TaskCompletion
```typescript
interface TaskCompletion {
  id: string;
  completedAt: Date;
  completedBy: string;
  notes?: string;
}
```

### FamilyMember
```typescript
interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  role: "parent" | "child" | "other";
}
```

## Error Handling

### Store Errors
```typescript
const { error, setError } = useTaskStore();

// Error tonen
if (error) {
  return <ErrorMessage message={error} />;
}

// Error resetten
setError(null);
```

### Form Errors
```typescript
// In TaskModal
const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = () => {
  const newErrors: Record<string, string> = {};
  if (!title.trim()) newErrors.title = "Titel is verplicht";
  if (!assignedTo) newErrors.assignedTo = "Kies een gezinslid";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## Events

### Task Events (voor analytics)
```typescript
// Te implementeren met analytics provider
trackEvent('task_created', { taskId, assignedTo });
trackEvent('task_completed', { taskId, completedBy });
trackEvent('task_deleted', { taskId });
trackEvent('task_updated', { taskId, fields: ['status', 'priority'] });
```

## Migration naar Supabase

### Huidige implementatie
```typescript
// lib/store/taskStore.ts
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({ /* ... */ }),
    { name: "rut-task-storage" }
  )
);
```

### Toekomstige implementatie
```typescript
// lib/store/taskStore.ts
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      // ... actions vervangen door Supabase calls
      createTask: async (taskData) => {
        const { data, error } = await supabase
          .from('tasks')
          .insert(taskData)
          .select()
          .single();
        // ...
      }
    }),
    { name: "rut-task-storage" }
  )
);
```

### Database Schema
```sql
-- tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES family_members(id),
  assigned_by UUID REFERENCES users(id),
  due_date DATE,
  recurrence_type TEXT DEFAULT 'none',
  recurrence_end_date DATE,
  reminder_enabled BOOLEAN DEFAULT false,
  reminder_time TIME,
  notifications_push BOOLEAN DEFAULT true,
  notifications_telegram BOOLEAN DEFAULT false,
  notifications_email BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- task_completions table
CREATE TABLE task_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  completed_by UUID REFERENCES users(id),
  notes TEXT
);
```
