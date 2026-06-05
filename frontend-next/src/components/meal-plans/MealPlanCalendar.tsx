"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Truck, Factory, Printer, Check } from "lucide-react"
import { CalendarDayCell } from "./CalendarDayCell"
import type { CalendarDay } from "@/hooks/useMealPlanCalendar"
import type { CalendarViewMode } from "@/hooks/useMealPlanCalendar"

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"]
const MONTH_LABELS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

interface MealPlanCalendarProps {
  year: number
  month: number
  calendarDays: CalendarDay[]
  selectedDate: string | null
  viewMode: CalendarViewMode
  activeMealPlanName: string
  onDateClick: (dateStr: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onYearMonthChange: (year: number, month: number) => void
  onPrint: () => void
}

export function MealPlanCalendar({
  year,
  month,
  calendarDays,
  selectedDate,
  viewMode,
  activeMealPlanName,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  onToday,
  onYearMonthChange,
  onPrint,
}: MealPlanCalendarProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(year)
  const [pickerMonth, setPickerMonth] = useState(month)

  const currentYear = new Date().getFullYear()
  const yearOptions = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - 4 + i),
    [currentYear],
  )

  const handlePickerOpen = () => {
    setPickerYear(year)
    setPickerMonth(month)
    setPickerOpen(true)
  }

  const handleConfirm = () => {
    onYearMonthChange(pickerYear, pickerMonth)
    setPickerOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* 년/월 선택 - Popover 대체: 인라인 드롭다운 */}
          <div className="relative">
            <Button
              variant="ghost"
              className="text-lg font-semibold min-w-[120px] hover:bg-accent"
              onClick={handlePickerOpen}
            >
              {year}년 {month}월
            </Button>
            {pickerOpen && (
              <>
                {/* 오버레이 */}
                <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
                <div className="absolute left-0 top-full z-50 mt-1 w-[280px] rounded-lg bg-popover p-3 shadow-md ring-1 ring-foreground/10">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {yearOptions.map((y) => (
                        <Button
                          key={y}
                          variant={y === pickerYear ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => setPickerYear(y)}
                        >
                          {y}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {MONTH_LABELS.map((label, i) => (
                        <Button
                          key={i}
                          variant={i + 1 === pickerMonth ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPickerMonth(i + 1)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-end pt-1">
                      <Button size="sm" onClick={handleConfirm}>
                        <Check className="h-4 w-4" />
                        이동
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <Button variant="outline" size="icon-sm" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToday} className="ml-2">
            오늘
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={viewMode === "production" ? "default" : "secondary"}
            className="gap-1"
          >
            {viewMode === "production" ? (
              <><Factory className="h-3 w-3" />생산일</>
            ) : (
              <><Truck className="h-3 w-3" />수령일</>
            )}
          </Badge>
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4" />
            인쇄
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="hidden print:block text-xl font-bold mb-4 text-center">
          {activeMealPlanName} — {year}년 {month}월
          ({viewMode === "production" ? "생산일" : "수령일"} 기준)
        </h2>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((label, i) => (
            <div
              key={label}
              className={cn(
                "text-center text-xs font-medium py-1",
                i === 0 && "text-red-500",
                i === 6 && "text-blue-500",
                i !== 0 && i !== 6 && "text-muted-foreground",
              )}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => (
            <CalendarDayCell
              key={day.dateStr}
              day={day}
              isSelected={selectedDate === day.dateStr}
              onClick={() => onDateClick(day.dateStr)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
