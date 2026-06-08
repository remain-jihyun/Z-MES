"use client"

import { useState, useCallback, useRef } from "react"
import { MealPlanCalendar } from "@/components/meal-plans/MealPlanCalendar"
import { ScheduleDetailSheet } from "@/components/meal-plans/ScheduleDetailSheet"
import { ScheduleDialog } from "@/components/meal-plans/ScheduleDialog"
import { AddItemsDialog } from "@/components/meal-plans/AddItemsDialog"
import { useMealPlanCalendar } from "@/hooks/useMealPlanCalendar"
import type { CalendarViewMode } from "@/hooks/useMealPlanCalendar"
import { useMealPlanSchedules } from "@/hooks/useMealPlanSchedules"
import { useMealPlanCrud } from "@/hooks/useMealPlanCrud"
import type { DailyMealPlan, MealPlanItem } from "@/types/meal-plan"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Plus, Upload } from "lucide-react"

export default function MenuPage() {
  const {
    dailyPlans,
    mealPlanTypes,
    isLoading,
    filter,
    updateFilter,
    activeMealPlanCode,
    setActiveMealPlanCode,
    selectedDailyPlan,
    setSelectedDailyPlan,
    reload,
  } = useMealPlanSchedules()

  const { handleCreate, handleBulkCreate, handleUpdate, handleDelete, isSubmitting } =
    useMealPlanCrud(reload)

  const [viewMode, setViewMode] = useState<CalendarViewMode>("production")

  const {
    year,
    month,
    calendarDays,
    selectedDate,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    setYearMonth,
  } = useMealPlanCalendar(dailyPlans, viewMode)

  const [detailOpen, setDetailOpen] = useState(false)
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<DailyMealPlan | null>(null)
  const [addItemsOpen, setAddItemsOpen] = useState(false)
  const [addItemsDate, setAddItemsDate] = useState("")

  const printRef = useRef<HTMLDivElement>(null)

  const handleMealPlanChange = useCallback(
    (code: string | null) => {
      if (code) {
        setActiveMealPlanCode(code)
        selectDate(null)
      }
    },
    [setActiveMealPlanCode, selectDate],
  )

  const handleYearMonthChange = useCallback(
    (y: number, m: number) => {
      setYearMonth(y, m)
      updateFilter({ year: y, month: m })
    },
    [setYearMonth, updateFilter],
  )

  const handleDateClick = useCallback(
    (dateStr: string) => {
      if (selectedDate === dateStr) {
        selectDate(null)
        setDetailOpen(false)
        return
      }
      selectDate(dateStr)
      const day = calendarDays.find((d) => d.dateStr === dateStr)
      if (day?.dailyPlan) {
        setSelectedDailyPlan(day.dailyPlan)
        setDetailOpen(true)
      } else if (day?.isCurrentMonth) {
        setAddItemsDate(dateStr)
        setAddItemsOpen(true)
      }
    },
    [selectedDate, selectDate, calendarDays, setSelectedDailyPlan],
  )

  const handleCreateClick = useCallback(() => {
    setEditingPlan(null)
    setScheduleDialogOpen(true)
  }, [])

  const handleEditClick = useCallback((plan: DailyMealPlan) => {
    setEditingPlan(plan)
    setDetailOpen(false)
    setScheduleDialogOpen(true)
  }, [])

  const handleDeleteClick = useCallback(
    async (id: string) => {
      await handleDelete(id)
      setSelectedDailyPlan(null)
      setDetailOpen(false)
    },
    [handleDelete, setSelectedDailyPlan],
  )

  const handleScheduleSave = useCallback(
    async (data: {
      startDate: string
      endDate: string
      mealPlanCode: string
      mealPlanName: string
      items: DailyMealPlan["items"]
    }) => {
      if (editingPlan) {
        await handleUpdate(editingPlan.id, { items: data.items })
      } else {
        await handleBulkCreate(
          data.startDate, data.endDate,
          data.mealPlanCode, data.mealPlanName, data.items,
        )
      }
      setScheduleDialogOpen(false)
      setEditingPlan(null)
    },
    [editingPlan, handleUpdate, handleBulkCreate],
  )

  const handleAddItemsSave = useCallback(
    async (items: MealPlanItem[]) => {
      const activeType = mealPlanTypes.find((t) => t.code === activeMealPlanCode)
      if (!activeType) return
      await handleCreate({
        date: addItemsDate,
        mealPlanCode: activeMealPlanCode,
        mealPlanName: activeType.name,
        items,
        syncStatus: "not_synced",
      })
      setAddItemsOpen(false)
    },
    [activeMealPlanCode, addItemsDate, mealPlanTypes, handleCreate],
  )

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank")
      if (!printWindow) return
      const activeTypeName = mealPlanTypes.find((t) => t.code === activeMealPlanCode)?.name ?? ""
      const modeLabel = viewMode === "production" ? "생산일" : "수령일"
      printWindow.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>${activeTypeName} ${year}년 ${month}월 (${modeLabel})</title>
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body { font-family:'Malgun Gothic',sans-serif;padding:12px; }
  h2 { text-align:center;font-size:22px;margin-bottom:12px; }
  .cal-grid { display:grid;grid-template-columns:repeat(7,1fr);gap:2px; }
  .weekday { text-align:center;font-weight:bold;padding:6px 0;font-size:14px;border-bottom:2px solid #333; }
  .day-cell { border:1px solid #ccc;padding:6px;min-height:100px; }
  .day-num { font-weight:bold;font-size:15px;margin-bottom:4px; }
  .item-row { font-size:13px;line-height:1.6; }
  @media print { body{padding:0;} @page{size:A3 landscape;margin:10mm;} }
</style></head><body>
<h2>${activeTypeName} — ${year}년 ${month}월 (${modeLabel} 기준)</h2>
<div class="cal-grid">
  ${["일","월","화","수","목","금","토"].map((d) => `<div class="weekday">${d}</div>`).join("")}
  ${calendarDays.map((day) => {
    const dn = day.date.getDate()
    const its = day.dailyPlan?.items ?? []
    return `<div class="day-cell ${!day.isCurrentMonth ? 'opacity-30' : ''}">
      <div class="day-num">${dn}</div>
      ${its.map((it) => `<div class="item-row">${it.productName}</div>`).join("")}
    </div>`
  }).join("")}
</div></body></html>`)
      printWindow.document.close()
      printWindow.onload = () => { printWindow.print() }
    }
  }

  const handleToday = useCallback(() => {
    const now = new Date()
    goToToday()
    updateFilter({ year: now.getFullYear(), month: now.getMonth() + 1 })
  }, [goToToday, updateFilter])

  const handlePrevMonth = useCallback(() => {
    goToPrevMonth()
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    updateFilter({ year: prevYear, month: prevMonth })
  }, [goToPrevMonth, month, year, updateFilter])

  const handleNextMonth = useCallback(() => {
    goToNextMonth()
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    updateFilter({ year: nextYear, month: nextMonth })
  }, [goToNextMonth, month, year, updateFilter])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    )
  }

  const activeTypeName = mealPlanTypes.find((t) => t.code === activeMealPlanCode)?.name ?? ""

  return (
    <div className="flex flex-col gap-4">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">MIS(삭제 예정)</p>
          <h1 className="text-2xl font-bold tracking-tight">정기식단 DB</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1" disabled>
            <Upload className="h-4 w-4" />
            엑셀 업로드
          </Button>
          <Button size="sm" className="gap-1" onClick={handleCreateClick}>
            <Plus className="h-4 w-4" />
            식단 배치 등록
          </Button>
        </div>
      </div>

      {/* 뷰 모드 + 식단 선택 */}
      <div className="px-4 lg:px-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("delivery")}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors",
              viewMode === "delivery"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            고객 수령일
          </button>
          <button
            type="button"
            onClick={() => setViewMode("production")}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors",
              viewMode === "production"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            공장 생산일
          </button>
        </div>

        <Select
          value={activeTypeName || "— 선택 —"}
          onValueChange={(v) => {
            if (v === "— 선택 —") return
            const found = mealPlanTypes.find((t) => t.name === v)
            if (found) handleMealPlanChange(found.code)
          }}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="— 선택 —">— 선택 —</SelectItem>
            {[...mealPlanTypes]
              .sort((a, b) => a.name.localeCompare(b.name, "ko"))
              .map((type) => (
                <SelectItem key={type.code} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* 캘린더 */}
      <div className="px-4 lg:px-6" ref={printRef}>
        <MealPlanCalendar
          year={year}
          month={month}
          calendarDays={calendarDays}
          selectedDate={selectedDate}
          viewMode={viewMode}
          activeMealPlanName={activeTypeName}
          onDateClick={handleDateClick}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onYearMonthChange={handleYearMonthChange}
          onPrint={handlePrint}
        />
      </div>

      <ScheduleDetailSheet
        schedule={selectedDailyPlan}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        viewMode={viewMode}
      />

      <AddItemsDialog
        open={addItemsOpen}
        onOpenChange={setAddItemsOpen}
        targetDate={addItemsDate}
        mealPlanCode={activeMealPlanCode}
        mealPlanName={activeTypeName}
        existingPlans={dailyPlans}
        onSave={handleAddItemsSave}
        isSubmitting={isSubmitting}
      />

      <ScheduleDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        editingPlan={editingPlan}
        mealPlanTypes={mealPlanTypes}
        defaultMealPlanCode={activeMealPlanCode}
        onSave={handleScheduleSave}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
