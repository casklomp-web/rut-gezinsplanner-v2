'use client';

import { useState } from 'react';
import { Check, Clock, AlertCircle, ChevronDown, ChevronUp, Trash2, Edit2, User, Bell, History } from 'lucide-react';
import { cn, formatRelativeDate, getInitials, isOverdue } from '@/lib/utils';
import { Task, TaskStatus, TaskPriority } from '@/lib/types/task';
import { useTaskStore } from '@/lib/store/taskStore';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { RecurrenceBadge } from './RecurrenceSelector';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Check; color: string; bgColor: string }> = {
  todo: { 
    label: 'Te doen', 
    icon: Clock, 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-100' 
  },
  'in-progress': { 
    label: 'Bezig', 
    icon: Clock, 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-100' 
  },
  done: { 
    label: 'Klaar', 
    icon: Check, 
    color: 'text-green-500', 
    bgColor: 'bg-green-100' 
  },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; dotColor: string }> = {
  low: { label: 'Laag', color: 'text-gray-500', dotColor: 'bg-gray-400' },
  medium: { label: 'Normaal', color: 'text-blue-500', dotColor: 'bg-blue-400' },
  high: { label: 'Hoog', color: 'text-red-500', dotColor: 'bg-red-400' },
};

export function TaskCard({ task, onEdit, expanded = false, onToggleExpand }: TaskCardProps) {
  const { toggleTaskStatus, completeTask, uncompleteTask, deleteTask, getFamilyMemberById } = useTaskStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(expanded);

  const assignee = getFamilyMemberById(task.assignedTo);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const StatusIcon = status.icon;
  const overdue = task.dueDate && task.status !== 'done' && isOverdue(task.dueDate);

  const handleStatusToggle = () => {
    if (task.status === 'done') {
      uncompleteTask(task.id);
    } else {
      completeTask(task.id);
    }
  };

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggleExpand?.();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl border-2 transition-all overflow-hidden',
          task.status === 'done'
            ? 'border-gray-200 dark:border-gray-700 opacity-75'
            : overdue
            ? 'border-red-300 dark:border-red-700'
            : 'border-transparent hover:border-[#4A90A4]/30',
          isExpanded && 'ring-2 ring-[#4A90A4]/20'
        )}
      >
        {/* Main Card Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Status Checkbox */}
            <button
              onClick={handleStatusToggle}
              className={cn(
                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5',
                task.status === 'done'
                  ? 'bg-[#7CB342] border-[#7CB342]'
                  : 'border-gray-300 dark:border-gray-600 hover:border-[#4A90A4]'
              )}
              aria-label={task.status === 'done' ? 'Markeer als niet klaar' : 'Markeer als klaar'}
            >
              {task.status === 'done' && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    'font-medium text-[#2D3436] dark:text-gray-100 truncate',
                    task.status === 'done' && 'line-through text-gray-400'
                  )}
                >
                  {task.title}
                </h3>
                
                {/* Expand/Collapse */}
                <button
                  onClick={handleToggleExpand}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                  aria-label={isExpanded ? 'Inklappen' : 'Uitklappen'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {/* Status Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    status.bgColor,
                    status.color
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </span>

                {/* Priority Badge */}
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs',
                    priority.color
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', priority.dotColor)} />
                  {priority.label}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <span
                    className={cn(
                      'text-xs flex items-center gap-1',
                      overdue
                        ? 'text-red-500 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {overdue && <AlertCircle className="w-3 h-3" />}
                    {formatRelativeDate(task.dueDate)}
                  </span>
                )}

                {/* Recurrence Indicator */}
                <RecurrenceBadge type={task.recurrence.type} endDate={task.recurrence.endDate} />

                {/* Reminder Indicator */}
                {task.reminder?.enabled && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    <Bell className="w-3 h-3" />
                    {task.reminder.time}
                  </span>
                )}
              </div>

              {/* Assignee */}
              {assignee && (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
                    style={{ backgroundColor: assignee.color }}
                  >
                    {getInitials(assignee.name)}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {assignee.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
            {/* Description */}
            {task.description && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Beschrijving
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {task.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Completion History */}
            {task.completions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <History className="w-3 h-3" />
                  Geschiedenis
                </h4>
                <div className="space-y-1.5">
                  {task.completions.slice(-3).map((completion) => (
                    <div
                      key={completion.id}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <Check className="w-3 h-3 text-green-500" />
                      <span>
                        Afgerond op{' '}
                        {new Date(completion.completedAt).toLocaleDateString('nl-NL')}
                      </span>
                      {completion.notes && (
                        <span className="text-gray-400">- {completion.notes}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recurrence Info */}
            {task.recurrence.type !== 'none' && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  Herhaling
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {recurrenceLabel}
                  {task.recurrence.endDate && (
                    <span className="text-gray-500">
                      {' '}tot {formatRelativeDate(task.recurrence.endDate)}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => onEdit(task)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#4A90A4] hover:bg-[#4A90A4]/10 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Bewerken
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Verwijderen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Taak verwijderen"
        description="Weet je zeker dat je deze taak wilt verwijderen? Dit kan niet ongedaan worden gemaakt."
        itemName={task.title}
        confirmText="Verwijderen"
        cancelText="Annuleren"
      />
    </>
  );
}
