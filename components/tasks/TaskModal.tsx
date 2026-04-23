'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Task, TaskPriority, RecurrenceType, FamilyMember, TaskReminder, TaskNotificationPrefs } from '@/lib/types/task';
import { useTaskStore } from '@/lib/store/taskStore';
import { useUserStore } from '@/lib/store/userStore';
import { RecurrenceSelector } from './RecurrenceSelector';
import { ReminderPicker } from './ReminderPicker';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null; // If provided, edit mode; otherwise create mode
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Laag', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Normaal', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'Hoog', color: 'bg-red-100 text-red-700' },
];

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { familyMembers, createTask, updateTask } = useTaskStore();
  const { users, currentUser } = useUserStore();
  const isEditMode = !!task;
  
  // Use users from userStore as family members for assignment
  const assignableMembers = users.length > 0 ? users : (currentUser ? [currentUser] : []);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [notificationPush, setNotificationPush] = useState(true);
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setAssignedTo(task.assignedTo);
      setDueDate(task.dueDate || '');
      setPriority(task.priority);
      setRecurrence(task.recurrence.type);
      setRecurrenceEndDate(task.recurrence.endDate || '');
      setReminderEnabled(!!task.reminder?.enabled);
      setReminderTime(task.reminder?.time || '09:00');
      setNotificationPush(task.notifications.push);
      setTags(task.tags.join(', '));
    } else {
      // Default values for new task
      setTitle('');
      setDescription('');
      setAssignedTo(familyMembers[0]?.id || '');
      setDueDate(new Date().toISOString().split('T')[0]);
      setPriority('medium');
      setRecurrence('none');
      setRecurrenceEndDate('');
      setReminderEnabled(false);
      setReminderTime('09:00');
      setNotificationPush(true);
      setTags('');
    }
    setErrors({});
  }, [task, familyMembers, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Titel is verplicht';
    }

    if (!assignedTo) {
      newErrors.assignedTo = 'Kies een gezinslid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo,
      assignedBy: familyMembers[0]?.id || '1', // Current user
      dueDate: dueDate || undefined,
      priority,
      status: 'todo' as const,
      recurrence: {
        type: recurrence,
        endDate: recurrenceEndDate || undefined,
      },
      reminder: reminderEnabled
        ? {
            enabled: true,
            time: reminderTime,
          }
        : undefined,
      notifications: {
        push: notificationPush,
        telegram: false,
        email: false,
      },
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isArchived: false,
    };

    try {
      if (isEditMode && task) {
        updateTask(task.id, taskData);
      } else {
        createTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFamilyMemberColor = (memberId: string) => {
    const member = familyMembers.find((m) => m.id === memberId);
    return member?.color || '#4A90A4';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="task-modal-title"
            className="text-lg font-semibold text-[#2D3436] dark:text-gray-100"
          >
            {isEditMode ? 'Taak bewerken' : 'Nieuwe taak'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Sluiten"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Titel <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wat moet er gedaan worden?"
              className={cn(
                'w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4]',
                errors.title
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Beschrijving
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Extra details (optioneel)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4] resize-none"
            />
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div>
              <label
                htmlFor="task-assignee"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Toewijzen aan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  id="task-assignee"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4] appearance-none',
                    errors.assignedTo
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                >
                  <option value="">Kies...</option>
                  {assignableMembers.map((member: any) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-500">{errors.assignedTo}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4]"
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prioriteit
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    priority === option.value
                      ? option.color + ' ring-2 ring-offset-2 ring-[#4A90A4]'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <RecurrenceSelector
              value={recurrence}
              onChange={setRecurrence}
              endDate={recurrenceEndDate}
              onEndDateChange={setRecurrenceEndDate}
            />
          </div>

          {/* Reminder */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <ReminderPicker
              reminder={reminderEnabled ? { enabled: true, time: reminderTime } : undefined}
              onChange={(reminder) => {
                setReminderEnabled(reminder?.enabled || false);
                if (reminder?.time) setReminderTime(reminder.time);
              }}
              notifications={{ push: notificationPush, telegram: false, email: false }}
              onNotificationsChange={(prefs) => setNotificationPush(prefs.push)}
            />
          </div>

          {/* Tags */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <label
                htmlFor="task-tags"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tags
              </label>
            </div>
            <input
              id="task-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="boodschappen, huishouden, etc. (gescheiden door komma's)"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Annuleren
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditMode ? 'Opslaan' : 'Taak aanmaken'}
          </Button>
        </div>
      </div>
    </div>
  );
}
