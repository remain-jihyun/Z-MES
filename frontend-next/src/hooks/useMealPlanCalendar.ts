"use client"

import { useState, useMemo, useCallback } from "react"
import type { DailyMealPlan } from "@/types/meal-plan"

export type CalendarViewMode = "delivery" | "production"

export interface CalendarDay {
  date: Date
  dateStr: string
  isCurrentMonth: boolean
  isToday: boolean
  dailyPlan: DailyMealPlan | null
}

// date-fns 없이 구현하는 유틸 함수들
function formatDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function addDaysUtil(d: Date, n: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + n)
  return result
}

function isSameDayUtil(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isSameMonthUtil(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function getCalendarDays(currentDate: Date): Date[] {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)

  // 주 시작: 일요일
  const calStart = new Date(monthStart)
  calStart.setDate(calStart.getDate() - calStart.getDay())

  const calEnd = new Date(monthEnd)
  const daysUntilSat = 6 - calEnd.getDay()
  calEnd.setDate(calEnd.getDate() + daysUntilSat)

  const days: Date[] = []
  const current = new Date(calStart)
  while (current <= calEnd) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

export function useMealPlanCalendar(
  dailyPlans: DailyMealPlan[],
  viewMode: CalendarViewMode,
) {
  const today = useMemo(() => new Date(), [])
  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const plansByDate = useMemo(() => {
    const map = new Map<string, DailyMealPlan>()
    for (const plan of dailyPlans) {
      if (viewMode === "production") {
        // 생산일 = 수령일 - 1일
        const productionDate = addDaysUtil(new Date(plan.date + "T00:00:00"), -1)
        const key = formatDateStr(productionDate)
        map.set(key, plan)
      } else {
        map.set(plan.date, plan)
      }
    }
    return map
  }, [dailyPlans, viewMode])

  const calendarDays = useMemo<CalendarDay[]>(() => {
    const days = getCalendarDays(currentDate)
    return days.map((date) => {
      const dateStr = formatDateStr(date)
      return {
        date,
        dateStr,
        isCurrentMonth: isSameMonthUtil(date, currentDate),
        isToday: isSameDayUtil(date, today),
        dailyPlan: plansByDate.get(dateStr) ?? null,
      }
    })
  }, [currentDate, plansByDate, today])

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((d) => {
      const prev = new Date(d)
      prev.setMonth(prev.getMonth() - 1)
      return prev
    })
  }, [])

  const goToNextMonth = useCallback(() => {
    setCurrentDate((d) => {
      const next = new Date(d)
      next.setMonth(next.getMonth() + 1)
      return next
    })
  }, [])

  const goToToday = useCallback(() => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(formatDateStr(today))
  }, [today])

  const selectDate = useCallback((dateStr: string | null) => {
    setSelectedDate(dateStr)
  }, [])

  const setYearMonth = useCallback((y: number, m: number) => {
    setCurrentDate(new Date(y, m - 1, 1))
  }, [])

  const selectedDailyPlan = useMemo(
    () => (selectedDate ? plansByDate.get(selectedDate) ?? null : null),
    [selectedDate, plansByDate],
  )

  return {
    year,
    month,
    currentDate,
    selectedDate,
    calendarDays,
    selectedDailyPlan,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    setYearMonth,
  }
}
