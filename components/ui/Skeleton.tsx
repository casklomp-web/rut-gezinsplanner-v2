'use client';

import { useState, useEffect } from 'react';
import { ChefHat, Clock, Calendar, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Skeleton components for loading states

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
}

export function DayViewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-48" />
      </div>

      {/* Meal cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}

      {/* Training skeleton */}
      <div className="bg-[#4A90A4]/10 rounded-xl p-4">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Checkins skeleton */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function WeekViewSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>

      {/* Day cards skeleton */}
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}

      {/* Button skeleton */}
      <Skeleton className="h-12 w-full rounded-xl mt-6" />
    </div>
  );
}

export function ShoppingListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Progress skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-3 w-24 mt-2" />
      </div>

      {/* Total skeleton */}
      <div className="bg-[#4A90A4]/10 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Store sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecipesListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Search skeleton */}
      <Skeleton className="h-12 w-full rounded-xl mb-4" />

      {/* Filter chips skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Recipe cards skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-4">
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-24 mt-1" />
              <div className="flex gap-1 mt-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-48" />

      {/* User card skeleton */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Settings sections skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
