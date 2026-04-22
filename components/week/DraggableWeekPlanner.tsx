'use client';

import { useState } from 'react';
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
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import {
  CSS,
} from '@dnd-kit/utilities';
import { Day, MealType } from '@/lib/types';
import { UtensilsCrossed, Dumbbell, Check, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useWeekStore } from '@/lib/store/weekStore';
import { useHaptic, HAPTIC_PATTERNS } from '@/components/providers/HapticProvider';
import { isFeatureEnabled } from '@/components/providers/FeatureProvider';
import { trackEvent, AnalyticsEvents } from '@/components/providers/FeatureProvider';

interface DraggableWeekPlannerProps {
  days: Day[];
  onSelectMeal?: (dayId: string, mealType: MealType) => void;
}

interface DragData {
  dayId: string;
  mealType: MealType;
  mealName: string;
}

export function DraggableWeekPlanner({ days, onSelectMeal }: DraggableWeekPlannerProps) {
  const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
  const { toggleMealComplete, toggleTrainingComplete, swapMealBetweenDays } = useWeekStore();
  const { vibrate } = useHaptic();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as DragData;
    setActiveDrag(data);
    vibrate(HAPTIC_PATTERNS.LIGHT);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDrag(null);

    if (!over) return;

    const sourceData = active.data.current as DragData;
    const targetData = over.data.current as DragData;

    if (!sourceData || !targetData) return;
    if (sourceData.dayId === targetData.dayId && sourceData.mealType === targetData.mealType) return;

    // Swap meals between days
    swapMealBetweenDays(sourceData.dayId, sourceData.mealType, targetData.dayId, targetData.mealType);
    
    vibrate(HAPTIC_PATTERNS.SUCCESS);
    trackEvent(AnalyticsEvents.MEAL_SWAPPED, {
      fromDay: sourceData.dayId,
      fromMeal: sourceData.mealType,
      toDay: targetData.dayId,
      toMeal: targetData.mealType,
    });
  };

  if (!isFeatureEnabled('ENABLE_DRAG_DROP')) {
    return (
      <div className="space-y-3">
        {days.map((day) => (
          <StaticDayCard
            key={day.id}
            day={day}
            onToggleMeal={toggleMealComplete}
            onToggleTraining={toggleTrainingComplete}
          />
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
      <div className="space-y-3">
        {days.map((day) => (
          <DroppableDayCard
            key={day.id}
            day={day}
            onToggleMeal={toggleMealComplete}
            onToggleTraining={toggleTrainingComplete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeDrag ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-[#4A90A4] p-4 opacity-90">
            <div className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{activeDrag.mealName}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// Droppable Day Card
interface DroppableDayCardProps {
  day: Day;
  onToggleMeal: (dayId: string, mealType: MealType) => void;
  onToggleTraining: (dayId: string) => void;
}

function DroppableDayCard({ day, onToggleMeal, onToggleTraining }: DroppableDayCardProps) {
  const dayDate = parseISO(day.date);
  const isToday = day.date === new Date().toISOString().split('T')[0];
  const { vibrate } = useHaptic();

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 border-2 transition-all",
        isToday ? "border-[#4A90A4] shadow-md" : "border-transparent hover:border-gray-200"
      )}
    >
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            isToday ? "text-[#4A90A4]" : "text-gray-500"
          )}>
            {format(dayDate, 'EEEE', { locale: nl })}
          </span>
          {isToday && (
            <span className="text-xs bg-[#4A90A4]/10 text-[#4A90A4] px-2 py-0.5 rounded-full">
              Vandaag
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {format(dayDate, 'd MMM', { locale: nl })}
        </span>
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <DraggableMealRow
          dayId={day.id}
          meal={day.meals.breakfast}
          mealType="breakfast"
          label="Ontbijt"
          onToggle={() => {
            vibrate(HAPTIC_PATTERNS.LIGHT);
            onToggleMeal(day.id, 'breakfast');
          }}
          onSelect={onSelectMeal ? () => onSelectMeal(day.id, 'breakfast') : undefined}
        />
        <DraggableMealRow
          dayId={day.id}
          meal={day.meals.lunch}
          mealType="lunch"
          label="Lunch"
          onToggle={() => {
            vibrate(HAPTIC_PATTERNS.LIGHT);
            onToggleMeal(day.id, 'lunch');
          }}
          onSelect={onSelectMeal ? () => onSelectMeal(day.id, 'lunch') : undefined}
        />
        <DraggableMealRow
          dayId={day.id}
          meal={day.meals.dinner}
          mealType="dinner"
          label="Diner"
          onToggle={() => {
            vibrate(HAPTIC_PATTERNS.LIGHT);
            onToggleMeal(day.id, 'dinner');
          }}
          onSelect={onSelectMeal ? () => onSelectMeal(day.id, 'dinner') : undefined}
        />
      </div>

      {/* Training */}
      {day.isTrainingDay && day.training && (
        <button
          onClick={() => {
            vibrate(HAPTIC_PATTERNS.MEDIUM);
            onToggleTraining(day.id);
          }}
          className={cn(
            "w-full mt-3 p-2 rounded-lg flex items-center gap-2 transition-colors",
            day.training.completed
              ? "bg-[#7CB342]/10 text-[#7CB342]"
              : "bg-[#4A90A4]/10 text-[#4A90A4]"
          )}
          aria-pressed={day.training.completed}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="text-sm font-medium flex-1 text-left">
            Training {day.training.time && `(${day.training.time})`}
          </span>
          {day.training.completed && <Check className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

// Draggable Meal Row
interface DraggableMealRowProps {
  dayId: string;
  meal: { mealId: string; mealName: string; completed: boolean };
  mealType: MealType;
  label: string;
  onToggle: () => void;
  onSelect?: () => void;
}

function DraggableMealRow({ dayId, meal, mealType, label, onToggle, onSelect }: DraggableMealRowProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${dayId}-${mealType}`,
    data: { dayId, mealType, mealName: meal.mealName } as DragData,
    disabled: !isFeatureEnabled('ENABLE_DRAG_DROP'),
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `${dayId}-${mealType}-drop`,
    data: { dayId, mealType, mealName: meal.mealName } as DragData,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        "rounded-lg transition-colors",
        isOver && "bg-[#4A90A4]/10 ring-2 ring-[#4A90A4]"
      )}
    >
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg transition-colors",
          meal.completed ? "bg-gray-50" : "hover:bg-gray-50",
          isDragging && "opacity-50"
        )}
      >
        {isFeatureEnabled('ENABLE_DRAG_DROP') && (
          <button
            {...attributes}
            {...listeners}
            className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-left"
          aria-pressed={meal.completed}
        >
          <div className={cn(
            "w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0",
            meal.completed
              ? "bg-[#7CB342] border-[#7CB342]"
              : "border-gray-300"
          )}>
            {meal.completed && <Check className="w-3 h-3 text-white" />}
          </div>
        </button>
        <button
          onClick={onSelect}
          className="flex-1 flex items-center gap-2 text-left min-w-0"
        >
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm truncate",
              meal.completed ? "text-gray-400 line-through" : "text-[#2D3436]"
            )}>
              {meal.mealName}
            </p>
          </div>
          <span className="text-xs text-gray-400">{label}</span>
        </button>
      </div>
    </div>
  );
}

// Static Day Card (fallback when drag is disabled)
interface StaticDayCardProps {
  day: Day;
  onToggleMeal: (dayId: string, mealType: MealType) => void;
  onToggleTraining: (dayId: string) => void;
}

function StaticDayCard({ day, onToggleMeal, onToggleTraining }: StaticDayCardProps) {
  const dayDate = parseISO(day.date);
  const isToday = day.date === new Date().toISOString().split('T')[0];
  const { vibrate } = useHaptic();

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 border-2 transition-all",
        isToday ? "border-[#4A90A4] shadow-md" : "border-transparent hover:border-gray-200"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            isToday ? "text-[#4A90A4]" : "text-gray-500"
          )}>
            {format(dayDate, 'EEEE', { locale: nl })}
          </span>
          {isToday && (
            <span className="text-xs bg-[#4A90A4]/10 text-[#4A90A4] px-2 py-0.5 rounded-full">
              Vandaag
            </span>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {format(dayDate, 'd MMM', { locale: nl })}
        </span>
      </div>

      <div className="space-y-2">
        {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((mealType) => {
          const meal = day.meals[mealType];
          const label = mealType === 'breakfast' ? 'Ontbijt' : mealType === 'lunch' ? 'Lunch' : 'Diner';
          return (
            <button
              key={mealType}
              onClick={() => {
                vibrate(HAPTIC_PATTERNS.LIGHT);
                onToggleMeal(day.id, mealType);
              }}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left",
                meal.completed ? "bg-gray-50" : "hover:bg-gray-50"
              )}
              aria-pressed={meal.completed}
            >
              <div className={cn(
                "w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                meal.completed
                  ? "bg-[#7CB342] border-[#7CB342]"
                  : "border-gray-300"
              )}>
                {meal.completed && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm truncate",
                  meal.completed ? "text-gray-400 line-through" : "text-[#2D3436]"
                )}>
                  {meal.mealName}
                </p>
              </div>
              <span className="text-xs text-gray-400">{label}</span>
            </button>
          );
        })}
      </div>

      {day.isTrainingDay && day.training && (
        <button
          onClick={() => {
            vibrate(HAPTIC_PATTERNS.MEDIUM);
            onToggleTraining(day.id);
          }}
          className={cn(
            "w-full mt-3 p-2 rounded-lg flex items-center gap-2 transition-colors",
            day.training.completed
              ? "bg-[#7CB342]/10 text-[#7CB342]"
              : "bg-[#4A90A4]/10 text-[#4A90A4]"
          )}
          aria-pressed={day.training.completed}
        >
          <Dumbbell className="w-4 h-4" />
          <span className="text-sm font-medium flex-1 text-left">
            Training {day.training.time && `(${day.training.time})`}
          </span>
          {day.training.completed && <Check className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}