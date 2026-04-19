/**
 * Loading Skeleton Components
 * Skeleton loaders for all pages
 */

'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
    />
  );
}

// Day View Skeleton
export function DayViewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-48" />
      </div>
      
      {/* Meal cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      ))}
      
      {/* Training card */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>
      
      {/* Check-ins */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
      </div>
      
      {/* Day score */}
      <Skeleton className="h-24 rounded-xl mt-6" />
    </div>
  );
}

// Week View Skeleton
export function WeekViewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
      
      {/* Day cards */}
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-4 h-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {/* Button */}
      <Skeleton className="h-12 w-full rounded-xl mt-6" />
    </div>
  );
}

// Shopping List Skeleton
export function ShoppingListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-40 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      
      {/* Total */}
      <Skeleton className="h-20 rounded-xl mb-6" />
      
      {/* Store sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Recipes List Skeleton
export function RecipesListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      {/* Search bar */}
      <Skeleton className="h-12 w-full rounded-xl mb-4" />
      
      {/* Filter chips */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      
      {/* Recipe cards */}
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Settings Skeleton
export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Skeleton className="h-8 w-32 mb-6" />
      
      {/* Sections */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Skeleton className="h-8 w-32 mb-6" />
      
      {/* Avatar section */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      {/* Form fields */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>
      
      {/* Button */}
      <Skeleton className="h-12 w-full rounded-xl mt-6" />
    </div>
  );
}

// Generic card skeleton
export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </>
  );
}
