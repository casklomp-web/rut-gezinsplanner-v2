'use client';

import { useState } from 'react';
import { X, Check, Clock, User, Calendar, Tag, History, Repeat, Bell, FileText, ChevronRight } from 'lucide-react';
import { cn, formatDate, formatRelativeDate, getInitials, isOverdue } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Task, TaskStatus, TaskPriority } from '@/lib/types/task';
import { useTaskStore } from '@/lib/store/taskStore';
import { RecurrenceBadge } from './RecurrenceSelector';

interface TaskDetailViewProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Check; color: string; bgColor: string; description: string }> = {
  todo: { 
    label: 'Te doen', 
    icon: Clock, 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    description: 'Deze taak staat nog op de planning'
  },
  'in-progress': { 
    label: 'Bezig', 
    icon: Clock, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    description: 'Er wordt momenteel aan gewerkt'
  },
  done: { 
    label: 'Klaar', 
    icon: Check, 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    description: 'Deze taak is afgerond'
  },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string; description: string }> = {
  low: { 
    label: 'Laag', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    description: 'Kan wachten als er andere prioriteiten zijn'
  },
  medium: { 
    label: 'Normaal', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    description: 'Standaard prioriteit'
  },
  high: { 
    label: 'Hoog', 
    color: 'text-red-600', 
    bgColor: 'bg-red-100',
    description: 'Moet zo snel mogelijk gebeuren'
  },
};

export function TaskDetailView({ task, isOpen, onClose, onEdit }: TaskDetailViewProps) {
  const { 
    toggleTaskStatus, 
    completeTask, 
    uncompleteTask, 
    deleteTask, 
    getFamilyMemberById,
    archiveTask 
  } = useTaskStore();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const assignee = getFamilyMemberById(task.assignedTo);
  const assigner = getFamilyMemberById(task.assignedBy);
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

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleArchive = () => {
    archiveTask(task.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', status.bgColor, status.color)}>
                  {status.label}
                </span>
                {overdue && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                    Achterstallig
                  </span>
                )}
              </div>
              <h2 className={cn(
                'text-xl font-semibold text-[#2D3436] dark:text-gray-100',
                task.status === 'done' && 'line-through text-gray-400'
              )}>
                {task.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('details')}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'details'
                ? 'text-[#4A90A4]'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Details
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A90A4]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'flex-1 py-3 text-sm font-medium transition-colors relative',
              activeTab === 'history'
                ? 'text-[#4A90A4]'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Geschiedenis ({task.completions.length})
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A90A4]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Description */}
              {task.description ? (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FileText className="w-4 h-4" />
                    Beschrijving
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              ) : (
                <div className="text-gray-400 italic text-sm">
                  Geen beschrijving
                </div>
              )}

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Assignee */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <User className="w-3.5 h-3.5" />
                    Toegewezen aan
                  </h3>
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                        style={{ backgroundColor: assignee.color }}
                      >
                        {getInitials(assignee.name)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {assignee.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {assignee.role === 'parent' ? 'Ouder' : 'Kind'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Onbekend</p>
                  )}
                </div>

                {/* Due Date */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    Deadline
                  </h3>
                  {task.dueDate ? (
                    <div>
                      <p className={cn(
                        'font-medium',
                        overdue ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'
                      )}>
                        {formatRelativeDate(task.dueDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(task.dueDate, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Geen deadline</p>
                  )}
                </div>

                {/* Priority */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Prioriteit
                  </h3>
                  <div className={cn('inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium', priority.bgColor, priority.color)}>
                    {priority.label}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {priority.description}
                  </p>
                </div>

                {/* Reminder */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <h3 className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <Bell className="w-3.5 h-3.5" />
                    Herinnering
                  </h3>
                  {task.reminder?.enabled ? (
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {task.reminder.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        Push notificatie
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400">Geen herinnering</p>
                  )}
                </div>
              </div>

              {/* Recurrence */}
              {task.recurrence.type !== 'none' && (
                <div className="bg-[#4A90A4]/5 rounded-xl p-3">
                  <h3 className="flex items-center gap-2 text-xs font-medium text-[#4A90A4] mb-2">
                    <Repeat className="w-3.5 h-3.5" />
                    Herhaling
                  </h3>
                  <RecurrenceBadge type={task.recurrence.type} endDate={task.recurrence.endDate} />
                  {task.recurrence.endDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Stopt op {formatDate(task.recurrence.endDate, { day: 'numeric', month: 'long' })}
                    </p>
                  )}
                </div>
              )}

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Created/Updated */}
              <div className="text-xs text-gray-400 space-y-1">
                <p>Aangemaakt: {formatDate(task.createdAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                <p>Laatst bijgewerkt: {formatDate(task.updatedAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                {assigner && <p>Toegewezen door: {assigner.name}</p>}
              </div>
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              {task.completions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Geen geschiedenis beschikbaar</p>
                  <p className="text-sm">Deze taak is nog nooit afgerond</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {task.completions.map((completion, index) => {
                    const completer = getFamilyMemberById(completion.completedBy);
                    return (
                      <div
                        key={completion.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Afgerond
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(completion.completedAt, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {completer && (
                            <p className="text-xs text-gray-400 mt-1">
                              Door: {completer.name}
                            </p>
                          )}
                          {completion.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-white dark:bg-gray-800 p-2 rounded-lg">
                              {completion.notes}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          #{index + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onEdit}
            >
              Bewerken
            </Button>
            {task.status !== 'done' ? (
              <Button
                className="flex-1"
                onClick={handleStatusToggle}
              >
                <Check className="w-4 h-4 mr-1" />
                Afronden
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleStatusToggle}
              >
                <Clock className="w-4 h-4 mr-1" />
                Heropenen
              </Button>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleArchive}
              className="flex-1 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Archiveren
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 py-2 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Verwijderen
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[#2D3436] dark:text-gray-100 mb-2">
                Taak verwijderen
              </h3>
              <p className="text-gray-500 mb-4">
                Weet je zeker dat je "{task.title}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Annuleren
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleDelete}
                >
                  Verwijderen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
