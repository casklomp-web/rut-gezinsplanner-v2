'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UseInfiniteScrollOptions<T> {
  items: T[];
  pageSize?: number;
  threshold?: number;
}

export function useInfiniteScroll<T>({
  items,
  pageSize = 10,
  threshold = 0.5,
}: UseInfiniteScrollOptions<T>) {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
  });

  // Initialize with first page
  useEffect(() => {
    setDisplayedItems(items.slice(0, pageSize));
    setPage(1);
    setHasMore(items.length > pageSize);
  }, [items, pageSize]);

  // Load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setIsLoading(true);
      
      // Simulate async loading for smooth UX
      const timer = setTimeout(() => {
        const nextPage = page + 1;
        const endIndex = nextPage * pageSize;
        const newItems = items.slice(0, endIndex);
        
        setDisplayedItems(newItems);
        setPage(nextPage);
        setHasMore(endIndex < items.length);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [inView, hasMore, isLoading, items, page, pageSize]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    const nextPage = page + 1;
    const endIndex = nextPage * pageSize;
    const newItems = items.slice(0, endIndex);
    
    setDisplayedItems(newItems);
    setPage(nextPage);
    setHasMore(endIndex < items.length);
    setIsLoading(false);
  }, [hasMore, isLoading, items, page, pageSize]);

  const reset = useCallback(() => {
    setDisplayedItems(items.slice(0, pageSize));
    setPage(1);
    setHasMore(items.length > pageSize);
    setIsLoading(false);
  }, [items, pageSize]);

  return {
    displayedItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    loaderRef: ref,
  };
}

// Loading indicator component
interface InfiniteScrollLoaderProps {
  isLoading: boolean;
  hasMore: boolean;
  className?: string;
}

export function InfiniteScrollLoader({
  isLoading,
  hasMore,
  className,
}: InfiniteScrollLoaderProps) {
  if (!isLoading && !hasMore) {
    return (
      <div className={cn("py-4 text-center text-sm text-gray-400", className)}>
        Einde van de lijst
      </div>
    );
  }

  if (!isLoading) return null;

  return (
    <div className={cn("py-4 flex justify-center", className)}>
      <Loader2 className="w-6 h-6 animate-spin text-[#4A90A4]" />
    </div>
  );
}
