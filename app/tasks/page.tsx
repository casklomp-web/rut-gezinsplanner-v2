'use client';

import { Suspense } from 'react';
import { ClipboardList } from 'lucide-react';
import { TaskBoard } from '@/components/tasks';
import { Skeleton } from '@/components/ui/Skeleton';

function TaskPageContent() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[#4A90A4] mb-2">
          <ClipboardList size={20} aria-hidden="true" />
          <span className="text-sm font-medium">Taken</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2D3436] dark:text-gray-100">
          Gezinstaken
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Beheer alle taken voor je gezin
        </p>
      </header>

      {/* Task Board */}
      <TaskBoard />
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<Skeleton />}> 
      <TaskPageContent />
    </Suspense>
  );
}
