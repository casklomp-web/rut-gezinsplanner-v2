"use client";

import { useEffect } from "react";
import { useWeekStore } from "@/lib/store/weekStore";
import { DayView } from "@/components/today/DayView";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

export default function TodayPage() {
  const { currentWeek, generateNewWeek, getToday } = useWeekStore();
  const today = getToday();

  useEffect(() => {
    if (!currentWeek) {
      generateNewWeek();
    }
  }, [currentWeek, generateNewWeek]);

  if (!today) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  const todayDate = parseISO(today.date);
  const weekNumber = currentWeek?.weekNumber;

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[#4A90A4] mb-1">
          <CalendarDays size={20} />
          <span className="text-sm font-medium">Week {weekNumber}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2D3436]">
          {format(todayDate, "EEEE d MMMM", { locale: nl })}
        </h1>
      </header>

      {/* Dag overzicht */}
      <DayView day={today} />
    </div>
  );
}
