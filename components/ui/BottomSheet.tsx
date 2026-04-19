'use client';

import { useState, ReactNode } from 'react';
import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/components/providers/FeatureProvider';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  showHandle?: boolean;
  snapPoints?: number[];
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showHandle = true,
  snapPoints,
}: BottomSheetProps) {
  // Fall back to regular modal on desktop or if feature is disabled
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  const useBottomSheet = isMobile && isFeatureEnabled('ENABLE_BOTTOM_SHEETS');

  if (!useBottomSheet) {
    // Render as regular modal
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div
          className={cn(
            "bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto",
            className
          )}
        >
          {(title || description) && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {title && (
                  <h2 className="text-lg font-semibold text-[#2D3436]">{title}</h2>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl",
            className
          )}
        >
          {showHandle && (
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
          )}
          
          {(title || description) && (
            <div className="px-4 pt-2 pb-3">
              <div className="flex items-center justify-between">
                {title && (
                  <Drawer.Title className="text-lg font-semibold text-[#2D3436]">
                    {title}
                  </Drawer.Title>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {description && (
                <Drawer.Description className="text-sm text-gray-500 mt-1">
                  {description}
                </Drawer.Description>
              )}
            </div>
          )}
          
          <div className="px-4 pb-6 overflow-y-auto max-h-[70vh]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

// Hook to determine if we should use bottom sheet
export function useBottomSheet() {
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  });

  return {
    useBottomSheet: isMobile && isFeatureEnabled('ENABLE_BOTTOM_SHEETS'),
    isMobile,
  };
}
