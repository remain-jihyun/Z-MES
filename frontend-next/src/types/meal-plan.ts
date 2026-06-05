/** Z-MIS 연동 상태 */
export type SyncStatus = "synced" | "pending" | "failed" | "not_synced"

/** 식단 카테고리 */
export type MealPlanCategory =
  | "standard" // 실속
  | "senior"   // 시니어
  | "family"   // 가족
  | "kids"     // 아이
  | "side"     // 반찬
  | "special"  // 특수

/** 식단 유형 마스터 */
export interface MealPlanType {
  code: string
  name: string
  description: string
  category: MealPlanCategory
  isActive: boolean
}

/** 식단 구성품 */
export interface MealPlanItem {
  zipCode: string
  productName: string
  weight: string
  quantity: number
}

/** 날짜별 식단 데이터 (핵심 엔티티) */
export interface DailyMealPlan {
  id: string
  date: string
  mealPlanCode: string
  mealPlanName: string
  items: MealPlanItem[]
  syncStatus: SyncStatus
  createdAt: string
  updatedAt: string
}

/** 식단 필터 */
export interface MealPlanFilter {
  year: number
  month: number
  mealPlanCode: string
  keyword: string
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
