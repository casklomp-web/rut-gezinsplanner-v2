"use client";

import { Day, MealInstance } from "@/lib/types";
import { useWeekStore } from "@/lib/store/weekStore";
import { Check, Dumbbell, Footprints, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";

interface DayViewProps {
  day: Day;
}

function MealCard({ 
  meal, 
  type, 
  dayId 
}: { 
  meal: MealInstance; 
  type: "breakfast" | "lunch" | "dinner";
  dayId: string;
}) {
  const { toggleMealComplete } = useWeekStore();
  
  const labels = {
    breakfast: "Ontbijt",
    lunch: "Lunch", 
    dinner: "Diner"
  };
  
  const icons = {
    breakfast: "🍳",
    lunch: "🥗",
    dinner: "🍽️"
  };

  return (
    <div className={cn(
      "bg-white rounded-xl p-4 mb-3 border transition-all",
      meal.completed 
        ? "border-[#7CB342] bg-[#7CB342]/5" 
        : "border-gray-200"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icons[type]}</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {labels[type]}
            </p>
            <p className="font-medium text-[#2D3436]">{meal.mealName}</p>
            {meal.isLeftover && (
              <p className="text-xs text-[#4A90A4]">🔄 Restje</p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => toggleMealComplete(dayId, type)}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            meal.completed
              ? "bg-[#7CB342] text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          )}
        >
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function TrainingCard({ day }: { day: Day }) {
  const { toggleTrainingComplete } = useWeekStore();
  
  if (!day.training?.scheduled) return null;

  return (
    <div className={cn(
      "bg-white rounded-xl p-4 mb-3 border transition-all",
      day.training.completed
        ? "border-[#7CB342] bg-[#7CB342]/5"
        : "border-gray-200"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4A90A4]/10 flex items-center justify-center">
            <Dumbbell size={20} className="text-[#4A90A4]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Training
            </p>
            <p className="font-medium text-[#2D3436]">
              {day.training.description}
            </p>
            <p className="text-sm text-gray-500">{day.training.time}</p>
          </div>
        </div>
        
        <button
          onClick={() => toggleTrainingComplete(day.id)}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all",
            day.training.completed
              ? "bg-[#7CB342] text-white"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          )}
        >
          <Check size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}

function CheckInItem({ 
  icon, 
  label, 
  completed, 
  onToggle 
}: { 
  icon: React.ReactNode;
  label: string;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all w-full text-left",
        completed
          ? "border-[#7CB342] bg-[#7CB342]/5"
          : "border-gray-200 bg-white"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
        completed
          ? "bg-[#7CB342] text-white"
          : "bg-gray-100 text-gray-400"
      )}>
        <Check size={16} strokeWidth={3} />
      </div>
      <span className={cn(
        "text-sm",
        completed ? "text-[#7CB342] font-medium" : "text-gray-600"
      )}>
        {label}
      </span>
    </button>
  );
}

export function DayView({ day }: DayViewProps) {
  const { toggleCheckin } = useWeekStore();
  
  const completedCount = [
    day.checkins.breakfast,
    day.checkins.lunch,
    day.checkins.dinner,
    day.checkins.training,
    day.checkins.walking,
    day.checkins.medication
  ].filter(Boolean).length;
  
  const totalCount = day.training?.scheduled ? 6 : 5;

  return (
    <div>
      {/* Maaltijden */}
      <MealCard meal={day.meals.breakfast} type="breakfast" dayId={day.id} />
      <MealCard meal={day.meals.lunch} type="lunch" dayId={day.id} />
      <MealCard meal={day.meals.dinner} type="dinner" dayId={day.id} />
      
      {/* Training */}
      <TrainingCard day={day} />
      
      {/* Extra check-ins */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <CheckInItem
          icon={<Footprints size={16} />}
          label="7.000+ stappen"
          completed={day.checkins.walking}
          onToggle={() => toggleCheckin(day.id, "walking")}
        />
        <CheckInItem
          icon={<Pill size={16} />}
          label="Medicatie"
          completed={day.checkins.medication}
          onToggle={() => toggleCheckin(day.id, "medication")}
        />
      </div>
      
      {/* Dagscore */}
      <div className="mt-6 bg-[#4A90A4]/10 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600 mb-1">Dagscore</p>
        <p className="text-2xl font-bold text-[#4A90A4]">
          {completedCount}/{totalCount} ✓
        </p>
        <p className="text-sm text-[#7CB342] mt-1">
          {completedCount === totalCount 
            ? "Geweldig! 🌟" 
            : completedCount >= totalCount / 2 
              ? "Goed bezig! 💪"
              : "Je kan dit! 🌱"
          }
        </p>
      </div>
    </div>
  );
}
