'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';
import { cn } from '@/lib/utils';

interface SwipeableItemProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: ReactNode;
    label: string;
    color: string;
  };
  rightAction?: {
    icon: ReactNode;
    label: string;
    color: string;
  };
  className?: string;
  threshold?: number;
}

export function SwipeableItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className,
  threshold = 80,
}: SwipeableItemProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const { vibrate } = useHaptic();

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true);
      // Limit swipe distance
      const maxOffset = 150;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, e.deltaX));
      setSwipeOffset(offset);
    },
    onSwiped: (e) => {
      setIsSwiping(false);
      
      if (e.deltaX > threshold && onSwipeRight) {
        vibrate(HAPTIC_PATTERNS.MEDIUM);
        onSwipeRight();
      } else if (e.deltaX < -threshold && onSwipeLeft) {
        vibrate(HAPTIC_PATTERNS.MEDIUM);
        onSwipeLeft();
      }
      
      // Reset position
      setSwipeOffset(0);
    },
    onSwipedLeft: () => {
      if (onSwipeLeft) {
        vibrate(HAPTIC_PATTERNS.LIGHT);
      }
    },
    onSwipedRight: () => {
      if (onSwipeRight) {
        vibrate(HAPTIC_PATTERNS.LIGHT);
      }
    },
    trackMouse: false,
  });

  const showLeftAction = swipeOffset > threshold / 2 && leftAction;
  const showRightAction = swipeOffset < -threshold / 2 && rightAction;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background actions */}
      <div className="absolute inset-0 flex">
        {/* Left action background */}
        {leftAction && (
          <div
            className={cn(
              "flex-1 flex items-center justify-start pl-4 transition-opacity duration-200",
              showLeftAction ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundColor: leftAction.color }}
          >
            <div className="flex items-center gap-2 text-white">
              {leftAction.icon}
              <span className="font-medium">{leftAction.label}</span>
            </div>
          </div>
        )}
        
        {/* Right action background */}
        {rightAction && (
          <div
            className={cn(
              "flex-1 flex items-center justify-end pr-4 transition-opacity duration-200",
              showRightAction ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundColor: rightAction.color }}
          >
            <div className="flex items-center gap-2 text-white">
              <span className="font-medium">{rightAction.label}</span>
              {rightAction.icon}
            </div>
          </div>
        )}
      </div>

      {/* Swipeable content */}
      <div
        {...handlers}
        className={cn(
          "relative bg-white transition-transform",
          isSwiping ? "duration-0" : "duration-300 ease-out"
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          touchAction: 'pan-y',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Pull to refresh component
interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
}

export function PullToRefresh({ children, onRefresh, className }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { vibrate } = useHaptic();

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (window.scrollY === 0 && e.deltaY > 0) {
        const maxPull = 100;
        const distance = Math.min(maxPull, e.deltaY * 0.5);
        setPullDistance(distance);
      }
    },
    onSwiped: async (e) => {
      if (pullDistance > 60 && !isRefreshing) {
        vibrate(HAPTIC_PATTERNS.MEDIUM);
        setIsRefreshing(true);
        await onRefresh();
        setIsRefreshing(false);
      }
      setPullDistance(0);
    },
    delta: 10,
  });

  return (
    <div {...handlers} className={cn("relative", className)}>
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200"
        style={{
          height: `${pullDistance}px`,
          opacity: pullDistance > 20 ? 1 : 0,
        }}
      >
        <div className={cn(
          "w-6 h-6 border-2 border-[#4A90A4] border-t-transparent rounded-full",
          isRefreshing && "animate-spin"
        )} />
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing ? 'transform 0.3s' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
}
