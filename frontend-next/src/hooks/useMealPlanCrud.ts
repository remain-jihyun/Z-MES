"use client"

import { useState, useCallback } from "react"
import type { DailyMealPlan } from "@/types/meal-plan"
import {
  createDailyMealPlan,
  createBulkDailyMealPlans,
  updateDailyMealPlan,
  deleteDailyMealPlan,
} from "@/lib/api/meal-plan"

export function useMealPlanCrud(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = useCallback(
    async (data: Omit<DailyMealPlan, "id" | "createdAt" | "updatedAt">) => {
      setIsSubmitting(true)
      try {
        const res = await createDailyMealPlan(data)
        if (res.success) {
          onSuccess()
          return res.data
        }
        console.error(res.message)
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess],
  )

  const handleBulkCreate = useCallback(
    async (
      startDate: string,
      endDate: string,
      mealPlanCode: string,
      mealPlanName: string,
      items: DailyMealPlan["items"],
    ) => {
      setIsSubmitting(true)
      try {
        const res = await createBulkDailyMealPlans(
          startDate,
          endDate,
          mealPlanCode,
          mealPlanName,
          items,
        )
        if (res.success) {
          onSuccess()
          return res.data
        }
        console.error(res.message)
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess],
  )

  const handleUpdate = useCallback(
    async (id: string, data: Partial<DailyMealPlan>) => {
      setIsSubmitting(true)
      try {
        const res = await updateDailyMealPlan(id, data)
        if (res.success) {
          onSuccess()
          return res.data
        }
        console.error(res.message)
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setIsSubmitting(true)
      try {
        const res = await deleteDailyMealPlan(id)
        if (res.success) {
          onSuccess()
        } else {
          console.error(res.message)
        }
        return res.success
      } finally {
        setIsSubmitting(false)
      }
    },
    [onSuccess],
  )

  return { handleCreate, handleBulkCreate, handleUpdate, handleDelete, isSubmitting }
}
