"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { CalendarDay } from "@/hooks/useMealPlanCalendar"

interface CalendarDayCellProps {
  day: CalendarDay
  isSelected: boolean
  onClick: () => void
}

export function CalendarDayCell({
  day,
  isSelected,
  onClick,
}: CalendarDayCellProps) {
  const dayNumber = day.date.getDate()
  const dayOfWeek = day.date.getDay()
  const hasData = !!day.dailyPlan
  const items = day.dailyPlan?.items ?? []

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-md border p-1.5 text-left transition-colors hover:bg-accent/50 min-h-[80px]",
        !day.isCurrentMonth && "opacity-30",
        day.isToday && "border-primary bg-primary/5",
        isSelected && "ring-2 ring-primary bg-primary/10",
        hasData && !isSelected && "border-blue-200 dark:border-blue-800",
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span
          className={cn(
            "text-xs font-medium",
            dayOfWeek === 0 && "text-red-500",
            dayOfWeek === 6 && "text-blue-500",
            day.isToday && "font-bold text-primary",
          )}
        >
          {dayNumber}
        </span>
        {hasData && (
          <Badge variant="secondary" className="h-4 px-1 text-[9px]">
            {items.length}품
          </Badge>
        )}
      </div>

      {hasData && (
        <div className="flex w-full flex-col gap-px mt-0.5">
          {items.slice(0, 4).map((item) => (
            <div
              key={item.zipCode}
              className="flex items-baseline gap-1 text-[10px] leading-tight"
            >
              <span className="truncate text-foreground">
                {item.productName}
              </span>
            </div>
          ))}
          {items.length > 4 && (
            <span className="text-[9px] text-muted-foreground">+{items.length - 4}개 더</span>
          )}
        </div>
      )}
    </button>
  )
}
