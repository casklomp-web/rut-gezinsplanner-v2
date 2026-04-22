'use client';

import { useState } from 'react';
import { Plus, Filter, Search, Clock, AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { useTaskStore } from '@/lib/store/taskStore';
import { Task, TaskStatus } from '@/lib/types/task';
import { NoTasksEmptyState, NoSearchResultsEmptyState, AllTasksCompletedEmptyState, NoOverdueTasksEmptyState } from './EmptyStates';

type FilterTab = 'all' | 'todo' | 'in-progress' | 'done' | 'overdue';

export function TaskBoard() {
  const { tasks, getFilteredTasks, getTaskStats, getOverdueTasks, getTasksDueToday } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const stats = getTaskStats();
  const overdueTasks = getOverdueTasks();
  const dueToday = getTasksDueToday();

  // Filter tasks based on active tab and search
  const getFilteredTasksList = () => {
    let filtered = tasks.filter((task) => !task.isArchived);

    // Apply tab filter
    switch (activeTab) {
      case 'todo':
        filtered = filtered.filter((t) => t.status === 'todo');
        break;
      case 'in-progress':
        filtered = filtered.filter((t) => t.status === 'in-progress');
        break;
      case 'done':
        filtered = filtered.filter((t) => t.status === 'done');
        break;
      case 'overdue':
        filtered = overdueTasks;
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort: overdue first, then by due date, then by priority
    return filtered.sort((a, b) => {
      // Overdue tasks first
      const aOverdue = a.dueDate && a.status !== 'done' && a.dueDate < new Date().toISOString().split('T')[0];
      const bOverdue = b.dueDate && b.status !== 'done' && b.dueDate < new Date().toISOString().split('T')[0];
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // Then by due date
      if (a.dueDate && b.dueDate) {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const filteredTasks = getFilteredTasksList();

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const tabs: { value: FilterTab; label: string; count?: number; icon: typeof CheckCircle2 }[] = [
    { value: 'all', label: 'Alle', count: stats.total, icon: Filter },
    { value: 'todo', label: 'Te doen', count: stats.todo, icon: Clock },
    { value: 'in-progress', label: 'Bezig', count: stats.inProgress, icon: RotateCcw },
    { value: 'done', label: 'Klaar', count: stats.done, icon: CheckCircle2 },
    { value: 'overdue', label: 'Achterstallig', count: stats.overdue, icon: AlertCircle },
  ];

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Openstaand</p>
          <p className="text-2xl font-bold text-[#2D3436] dark:text-gray-100">
            {stats.todo + stats.inProgress}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Vandaag</p>
          <p className="text-2xl font-bold text-[#4A90A4]">{dueToday.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">Achterstallig</p>
          <p className={cn(
            'text-2xl font-bold',
            stats.overdue > 0 ? 'text-red-500' : 'text-[#2D3436] dark:text-gray-100'
          )}>
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* Search & Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek taken..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4A90A4] text-sm"
          />
        </div>
        <Button onClick={handleCreateTask} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Nieuw
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.value
                ? 'bg-[#4A90A4] text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={cn(
                  'ml-0.5 px-1.5 py-0.5 rounded-full text-xs',
                  activeTab === tab.value
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Task List - Horizontal scroll on desktop, vertical on mobile */}
      <div className="lg:flex lg:gap-4 lg:overflow-x-auto lg:pb-4 lg:-mx-4 lg:px-4 lg:snap-x lg:snap-mandatory space-y-3 lg:space-y-0">
        {filteredTasks.length === 0 ? (
          searchQuery ? (
            <NoSearchResultsEmptyState onClear={() => setSearchQuery('')} />
          ) : activeTab === 'overdue' ? (
            <NoOverdueTasksEmptyState />
          ) : activeTab === 'done' ? (
            <AllTasksCompletedEmptyState />
          ) : activeTab === 'all' && stats.total === 0 ? (
            <NoTasksEmptyState onCreate={handleCreateTask} />
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Geen taken in deze categorie</p>
            </div>
          )
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="lg:flex-shrink-0 lg:w-80 lg:snap-start">
              <TaskCard
                task={task}
                onEdit={handleEditTask}
                expanded={expandedTaskId === task.id}
                onToggleExpand={() => handleToggleExpand(task.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />
    </div>
  );
}
