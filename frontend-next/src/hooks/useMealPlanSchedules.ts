"use client"

import { useState, useEffect, useCallback } from "react"
import type { DailyMealPlan, MealPlanType, MealPlanFilter } from "@/types/meal-plan"
import { getDailyMealPlans, getMealPlanTypes } from "@/lib/api/meal-plan"

export function useMealPlanSchedules() {
  const today = new Date()
  const [dailyPlans, setDailyPlans] = useState<DailyMealPlan[]>([])
  const [mealPlanTypes, setMealPlanTypes] = useState<MealPlanType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeMealPlanCode, setActiveMealPlanCode] = useState("")
  const [filter, setFilter] = useState<MealPlanFilter>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    mealPlanCode: "",
    keyword: "",
  })

  const [selectedDailyPlan, setSelectedDailyPlan] =
    useState<DailyMealPlan | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [plansData, typesData] = await Promise.all([
        getDailyMealPlans({
          ...filter,
          mealPlanCode: activeMealPlanCode,
        }),
        getMealPlanTypes(),
      ])
      setDailyPlans(plansData)
      setMealPlanTypes(typesData)
      if (!activeMealPlanCode && typesData.length > 0) {
        setActiveMealPlanCode(typesData[0].code)
      }
    } finally {
      setIsLoading(false)
    }
  }, [filter, activeMealPlanCode])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateFilter = useCallback((partial: Partial<MealPlanFilter>) => {
    setFilter((prev) => ({ ...prev, ...partial }))
  }, [])

  return {
    dailyPlans,
    mealPlanTypes,
    isLoading,
    filter,
    updateFilter,
    activeMealPlanCode,
    setActiveMealPlanCode,
    selectedDailyPlan,
    setSelectedDailyPlan,
    reload: loadData,
  }
}
