'use client';

import { useWeekStore } from "@/lib/store/weekStore";
import { WeekViewSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/ErrorBoundary";
import { Button } from "@/components/ui/Button";
import { CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { Suspense } from "react";

function HistoryPageContent() {
  const { weekHistory } = useWeekStore();

  if (weekHistory.length === 0) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto">
        <EmptyState
          icon={CalendarDays}
          title="Geen geschiedenis"
          description="Je weekgeschiedenis verschijnt hier nadat je nieuwe weken hebt gegenereerd"
          action={
            <Button onClick={() => window.location.href = '/week'}>
              Ga naar weekoverzicht
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2D3436]">Geschiedenis</h1>
        <p className="text-sm text-gray-500">Eerdere weekplanningen</p>
      </div>

      {/* History list */}
      <div className="space-y-3">
        {weekHistory.map((week) => (
          <div
            key={week.id}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#4A90A4] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#2D3436]">
                  Week {week.weekNumber}, {week.year}
                </h3>
                <p className="text-sm text-gray-500">
                  {format(parseISO(week.startDate), "d MMM", { locale: nl })} - {format(parseISO(week.endDate), "d MMM", { locale: nl })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {week.stats.mealsPlanned} maaltijden
                </p>
                <p className="text-sm text-[#4A90A4]">
                  €{week.stats.estimatedCost}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<WeekViewSkeleton />}>
      <HistoryPageContent />
    </Suspense>
  );
}
