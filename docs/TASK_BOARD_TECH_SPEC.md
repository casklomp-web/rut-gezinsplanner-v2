# Task Board - Technical Specification

## Overview
Het Task Board is een compleet takenbeheersysteem voor de Rut app, ontworpen voor gezinnen om taken te beheren, toewijzen en volgen.

## Architecture

### Data Flow
```
User Action → TaskStore (Zustand) → LocalStorage (Persist) → UI Update
```

### Components Hierarchy
```
TaskBoard (page)
├── TaskStats (header stats)
├── Search & Filter
├── TaskTabs (filter tabs)
├── TaskList
│   └── TaskCard (expandable)
│       └── TaskDetailView (modal)
├── TaskModal (create/edit)
└── DeleteConfirmModal
```

## State Management

### TaskStore (Zustand)
- **Persist**: LocalStorage
- **State**: tasks[], familyMembers[], filters, isLoading, error
- **Actions**: CRUD operaties, filters, archivering

### Key State Patterns
```typescript
// Optimistic updates
const updateTask = (taskId, updates) => {
  set(state => ({
    tasks: state.tasks.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    )
  }));
};
```

## Types

### Core Types
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string; // family member id
  assignedBy: string;
  dueDate?: string; // ISO date
  recurrence: {
    type: 'none' | 'daily' | 'weekly' | 'monthly';
    endDate?: string;
    interval?: number;
  };
  reminder?: {
    enabled: boolean;
    time: string; // HH:mm
  };
  notifications: {
    push: boolean;
    telegram: boolean;
    email: boolean;
  };
  completions: TaskCompletion[];
  tags: string[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Component API

### TaskModal
| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Modal visibility |
| onClose | () => void | Close handler |
| task? | Task | Edit mode if provided |

### TaskCard
| Prop | Type | Description |
|------|------|-------------|
| task | Task | Task data |
| onEdit | (task) => void | Edit handler |
| expanded? | boolean | Initial expanded state |
| onToggleExpand? | () => void | Expand toggle handler |

### TaskDetailView
| Prop | Type | Description |
|------|------|-------------|
| task | Task | Task data |
| isOpen | boolean | View visibility |
| onClose | () => void | Close handler |
| onEdit | () => void | Edit handler |

## Features

### Implemented
- ✅ CRUD operaties voor taken
- ✅ Terugkerende taken (dagelijks/wekelijks/maandelijks)
- ✅ Prioriteit levels (laag/normaal/hoog)
- ✅ Toewijzen aan gezinsleden
- ✅ Deadline tracking met overdue detectie
- ✅ Taak geschiedenis (completions)
- ✅ Herinneringen met tijd picker
- ✅ Notificatie voorkeuren (push/telegram)
- ✅ Tags systeem
- ✅ Archivering
- ✅ Zoeken & filteren
- ✅ Detail view met tabs

### Mock Data
Development mode gebruikt mock family members:
- Papa (parent)
- Mama (parent)  
- Kids (child)

## Styling

### Design Tokens
- Primary: `#4A90A4` (blauw)
- Success: `#7CB342` (groen)
- Warning: `text-amber-600` (amber)
- Danger: `text-red-500` (rood)
- Background: `bg-white dark:bg-gray-800`
- Border: `border-gray-200 dark:border-gray-700`

### Component Patterns
- Cards: `rounded-xl border-2`
- Buttons: `rounded-xl font-medium`
- Inputs: `rounded-lg border focus:ring-2 focus:ring-[#4A90A4]`
- Badges: `rounded-full px-2 py-0.5 text-xs`

## Accessibility

### ARIA Labels
- Status checkboxes: "Markeer als klaar/niet klaar"
- Expand buttons: "Uitklappen/Inklappen"
- Modal: `role="dialog" aria-modal="true"`

### Keyboard Navigation
- Tab: Navigate between form fields
- Enter: Submit forms
- Escape: Close modals

## Performance

### Optimizations
- Zustand selectors voor specifieke state
- Memoization via React hooks
- Lazy loading van TaskDetailView
- Persist alleen essentiële data

### Bundle Size
- Task components: ~15KB gzipped
- TaskStore: ~5KB gzipped
- Types: Shared met andere modules

## Future Enhancements

### Planned
- [ ] Supabase integratie voor sync
- [ ] Push notificaties service worker
- [ ] Telegram bot integratie
- [ ] Drag & drop reordering
- [ ] Bulk acties
- [ ] Templates voor terugkerende taken
- [ ] Dependencies tussen taken

### Technical Debt
- [ ] UUID vervangen door crypto.randomUUID()
- [ ] Form validatie met Zod
- [ ] Error boundaries toevoegen
- [ ] Loading skeletons
- [ ] Empty states verbeteren
