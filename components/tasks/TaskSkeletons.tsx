'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ 
  className, 
  variant = 'text',
  width,
  height 
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
  
  const variantStyles = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'rounded-xl h-24 w-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
    />
  );
}

// Task-specific skeletons

export function TaskCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton variant="circle" className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton variant="circle" className="w-5 h-5" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TaskBoardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Search skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-1">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>

      {/* Task list skeleton */}
      <TaskListSkeleton count={4} />
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/4" />
        </div>
        <Skeleton variant="circle" className="w-10 h-10" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
          <Skeleton className="h-3 w-20" />
          <div className="flex items-center gap-2">
            <Skeleton variant="circle" className="w-8 h-8" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-12" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 pt-4 border-t">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export function TaskModalSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>

      {/* Assignee & Due Date */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
      </div>

      {/* Recurrence */}
      <div className="space-y-2 pt-4 border-t">
        <Skeleton className="h-4 w-20" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-4 border-t">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}
