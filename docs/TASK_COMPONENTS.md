# Task Components Documentation

## TaskBoard

Het hoofdcomponent voor het weergeven en beheren van taken.

### Usage
```tsx
import { TaskBoard } from '@/components/tasks';

export default function TasksPage() {
  return <TaskBoard />;
}
```

### Features
- Statistieken header (openstaand/vandaag/achterstallig)
- Zoekfunctionaliteit
- Filter tabs (Alle/Te doen/Bezig/Klaar/Achterstallig)
- Taken lijst met TaskCard componenten
- "Nieuwe taak" knop

### State
- `isModalOpen`: boolean
- `editingTask`: Task | null
- `activeTab`: FilterTab
- `searchQuery`: string
- `expandedTaskId`: string | null

---

## TaskCard

Compacte weergave van een taak in de lijst.

### Props
```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}
```

### Usage
```tsx
<TaskCard
  task={task}
  onEdit={handleEdit}
  expanded={expandedTaskId === task.id}
  onToggleExpand={() => handleToggle(task.id)}
/>
```

### Features
- Status checkbox (todo/in-progress/done)
- Prioriteit indicator
- Deadline weergave (met overdue warning)
- Herhaling badge
- Herinnering badge
- Toegewezen persoon avatar
- Uitklapbare details
- Bewerken/Verwijderen acties
- Click voor detail view

---

## TaskModal

Modal voor het aanmaken of bewerken van taken.

### Props
```typescript
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null; // null = create mode
}
```

### Usage
```tsx
const [isOpen, setIsOpen] = useState(false);
const [editingTask, setEditingTask] = useState<Task | null>(null);

<TaskModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  task={editingTask}
/>
```

### Form Fields
- Titel (verplicht)
- Beschrijving (optioneel)
- Toewijzen aan (verplicht)
- Deadline (optioneel)
- Prioriteit (laag/normaal/hoog)
- Herhaling (eenmalig/dagelijks/wekelijks/maandelijks)
- Herinnering (tijd + notificatie kanalen)
- Tags (comma-separated)

### Validation
- Titel mag niet leeg zijn
- Gezinslid moet geselecteerd zijn

---

## TaskDetailView

Uitgebreide weergave van taak details in een modal.

### Props
```typescript
interface TaskDetailViewProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}
```

### Usage
```tsx
<TaskDetailView
  task={task}
  isOpen={showDetail}
  onClose={() => setShowDetail(false)}
  onEdit={() => {
    setShowDetail(false);
    setEditingTask(task);
    setIsModalOpen(true);
  }}
/>
```

### Tabs
1. **Details**: Volledige taak informatie
   - Beschrijving
   - Toegewezen aan
   - Deadline
   - Prioriteit
   - Herinnering
   - Herhaling
   - Tags
   - Metadata (aangemaakt/bijgewerkt)

2. **Geschiedenis**: Lijst van completions
   - Datum/tijd
   - Door wie
   - Notities

### Actions
- Bewerken
- Afronden/Heropenen
- Archiveren
- Verwijderen

---

## RecurrenceSelector

Component voor het selecteren van herhalingspatronen.

### Props
```typescript
interface RecurrenceSelectorProps {
  value: RecurrenceType;
  onChange: (value: RecurrenceType) => void;
  endDate?: string;
  onEndDateChange: (date: string) => void;
  interval?: number;
  onIntervalChange?: (interval: number) => void;
  compact?: boolean;
}
```

### Usage
```tsx
<RecurrenceSelector
  value={recurrence}
  onChange={setRecurrence}
  endDate={endDate}
  onEndDateChange={setEndDate}
/>
```

### Options
- **Eenmalig**: Geen herhaling
- **Dagelijks**: Elke dag
- **Wekelijks**: Elke week
- **Maandelijks**: Elke maand

---

## RecurrenceBadge

Compacte badge voor herhalingsweergave.

### Props
```typescript
interface RecurrenceBadgeProps {
  type: RecurrenceType;
  endDate?: string;
  className?: string;
}
```

### Usage
```tsx
<RecurrenceBadge type="weekly" endDate="2025-12-31" />
```

---

## ReminderPicker

Component voor het instellen van herinneringen.

### Props
```typescript
interface ReminderPickerProps {
  reminder?: TaskReminder;
  onChange: (reminder: TaskReminder | undefined) => void;
  notifications: TaskNotificationPrefs;
  onNotificationsChange: (prefs: TaskNotificationPrefs) => void;
}
```

### Usage
```tsx
<ReminderPicker
  reminder={{ enabled: true, time: "09:00" }}
  onChange={setReminder}
  notifications={{ push: true, telegram: false, email: false }}
  onNotificationsChange={setNotifications}
/>
```

### Features
- Enable/disable toggle
- Tijd picker
- Dagen van de week selectie
- Notificatie kanalen (Push/Telegram/Email)

---

## ReminderBadge

Compacte badge voor herinneringsweergave.

### Props
```typescript
interface ReminderBadgeProps {
  time?: string;
  enabled?: boolean;
  className?: string;
}
```

### Usage
```tsx
<ReminderBadge time="09:00" enabled={true} />
```

---

## PushNotificationPlaceholder

Placeholder component voor push notificatie onboarding.

### Usage
```tsx
<PushNotificationPlaceholder />
```

---

## Styling Guidelines

### Common Classes
```css
/* Card */
bg-white dark:bg-gray-800 rounded-xl border-2

/* Button Primary */
bg-[#4A90A4] text-white hover:bg-[#3a7a8c] rounded-xl

/* Button Secondary */
bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-xl

/* Input */
px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
focus:outline-none focus:ring-2 focus:ring-[#4A90A4]

/* Badge */
px-2 py-0.5 rounded-full text-xs font-medium
```

### Color Tokens
- Primary: `#4A90A4`
- Success: `#7CB342`
- Warning: `amber`
- Danger: `red-500`
- Info: `blue-500`

### Dark Mode
Alle componenten ondersteunen dark mode via `dark:` prefix.

---

## Accessibility

### Keyboard Navigation
- Tab: Navigeer tussen elementen
- Enter/Space: Activeer knoppen
- Escape: Sluit modals

### ARIA Labels
```tsx
<button aria-label="Markeer als klaar">
<button aria-label="Uitklappen">
<div role="dialog" aria-modal="true">
```

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-[#4A90A4]
```
