import type {
  MealPlanType,
  DailyMealPlan,
  MealPlanFilter,
  ApiResponse,
} from "@/types/meal-plan"
import {
  MOCK_MEAL_PLAN_TYPES,
  MOCK_DAILY_MEAL_PLANS,
} from "@/mocks/meal-plan"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))
const STORAGE_KEY = "mes-meal-plans"
const VERSION_KEY = "mes-meal-plans-version"
const CURRENT_VERSION = `v-${MOCK_DAILY_MEAL_PLANS.length}`

function loadPlans(): DailyMealPlan[] {
  if (typeof window === "undefined") return [...MOCK_DAILY_MEAL_PLANS]
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY)
    if (storedVersion === CURRENT_VERSION) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored) as DailyMealPlan[]
    }
  } catch { /* 파싱 실패 시 Mock 사용 */ }
  const initial = [...MOCK_DAILY_MEAL_PLANS]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
  return initial
}

function savePlans(plans: DailyMealPlan[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
}

export function resetToMock() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export async function getMealPlanTypes(): Promise<MealPlanType[]> {
  await delay(100)
  return MOCK_MEAL_PLAN_TYPES.filter((t) => t.isActive)
}

export async function getDailyMealPlans(
  filter: MealPlanFilter,
): Promise<DailyMealPlan[]> {
  await delay(200)
  const plans = loadPlans()
  const monthStart = `${filter.year}-${String(filter.month).padStart(2, "0")}-01`
  const lastDay = new Date(filter.year, filter.month, 0).getDate()
  const monthEnd = `${filter.year}-${String(filter.month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

  return plans.filter((d) => {
    if (d.date < monthStart || d.date > monthEnd) return false
    if (filter.mealPlanCode && d.mealPlanCode !== filter.mealPlanCode) return false
    if (filter.keyword) {
      const q = filter.keyword.toLowerCase()
      const matchName = d.mealPlanName.toLowerCase().includes(q)
      const matchItem = d.items.some(
        (i) => i.productName.toLowerCase().includes(q) || i.zipCode.toLowerCase().includes(q),
      )
      if (!matchName && !matchItem) return false
    }
    return true
  })
}

export async function getDailyMealPlan(id: string): Promise<DailyMealPlan | null> {
  await delay(100)
  return loadPlans().find((d) => d.id === id) ?? null
}

export async function createDailyMealPlan(
  data: Omit<DailyMealPlan, "id" | "createdAt" | "updatedAt">,
): Promise<ApiResponse<DailyMealPlan>> {
  await delay(300)
  const plans = loadPlans()
  const now = new Date().toISOString()
  const newPlan: DailyMealPlan = {
    ...data,
    id: `dmp-${data.mealPlanCode}-${data.date}-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  plans.push(newPlan)
  savePlans(plans)
  return { success: true, data: newPlan, message: "식단이 등록되었습니다." }
}

export async function createBulkDailyMealPlans(
  startDate: string,
  endDate: string,
  mealPlanCode: string,
  mealPlanName: string,
  items: DailyMealPlan["items"],
): Promise<ApiResponse<DailyMealPlan[]>> {
  await delay(400)
  const plans = loadPlans()
  const now = new Date().toISOString()
  const start = new Date(startDate)
  const end = new Date(endDate)
  const created: DailyMealPlan[] = []

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) continue
    const dateStr = d.toISOString().split("T")[0]
    if (plans.some((p) => p.date === dateStr && p.mealPlanCode === mealPlanCode)) continue
    const newPlan: DailyMealPlan = {
      id: `dmp-${mealPlanCode}-${dateStr}-${Date.now()}`,
      date: dateStr,
      mealPlanCode,
      mealPlanName,
      items: [...items],
      syncStatus: "not_synced",
      createdAt: now,
      updatedAt: now,
    }
    plans.push(newPlan)
    created.push(newPlan)
  }

  savePlans(plans)
  return { success: true, data: created, message: `${created.length}일분 식단이 등록되었습니다.` }
}

export async function updateDailyMealPlan(
  id: string,
  data: Partial<DailyMealPlan>,
): Promise<ApiResponse<DailyMealPlan>> {
  await delay(300)
  const plans = loadPlans()
  const idx = plans.findIndex((d) => d.id === id)
  if (idx === -1)
    return { success: false, data: plans[0], message: "식단을 찾을 수 없습니다." }

  plans[idx] = { ...plans[idx], ...data, updatedAt: new Date().toISOString() }
  savePlans(plans)
  return { success: true, data: plans[idx], message: "식단이 수정되었습니다." }
}

export async function deleteDailyMealPlan(id: string): Promise<ApiResponse<null>> {
  await delay(200)
  const plans = loadPlans()
  const filtered = plans.filter((d) => d.id !== id)
  if (filtered.length === plans.length)
    return { success: false, data: null, message: "식단을 찾을 수 없습니다." }

  savePlans(filtered)
  return { success: true, data: null, message: "식단이 삭제되었습니다." }
}
