'use client';

import { useState, ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isFeatureEnabled } from '@/components/providers/FeatureProvider';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';

interface SortableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
  dragHandleClassName?: string;
}

function SortableItem({ id, children, className, dragHandleClassName }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex items-center gap-2",
        isDragging && "opacity-50",
        className
      )}
    >
      {isFeatureEnabled('ENABLE_DRAG_DROP') && (
        <button
          {...attributes}
          {...listeners}
          className={cn(
            "p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600",
            dragHandleClassName
          )}
        >
          <GripVertical className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface DragAndDropListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  getItemId: (item: T) => string;
  className?: string;
  itemClassName?: string;
}

export function DragAndDropList<T>({
  items,
  onReorder,
  renderItem,
  getItemId,
  className,
  itemClassName,
}: DragAndDropListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { vibrate } = useHaptic();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    vibrate(HAPTIC_PATTERNS.LIGHT);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
      const newIndex = items.findIndex((item) => getItemId(item) === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder(newItems);
      vibrate(HAPTIC_PATTERNS.SUCCESS);
    }

    setActiveId(null);
  };

  if (!isFeatureEnabled('ENABLE_DRAG_DROP')) {
    // Render as regular list without drag functionality
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={getItemId(item)} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>
          {items.map((item, index) => (
            <SortableItem
              key={getItemId(item)}
              id={getItemId(item)}
              className={itemClassName}
            >
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            {renderItem(
              items.find((item) => getItemId(item) === activeId)!,
              items.findIndex((item) => getItemId(item) === activeId)
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
