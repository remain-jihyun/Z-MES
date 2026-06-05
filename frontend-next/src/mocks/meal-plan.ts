import type { MealPlanType, DailyMealPlan, MealPlanItem } from "@/types/meal-plan"

/** 식단 유형 마스터 (15개) */
export const MOCK_MEAL_PLAN_TYPES: MealPlanType[] = [
  { code: "ZIP_P_9076", name: "든든한 아이 식단", description: "아이 맞춤 프리미엄 식단", category: "kids", isActive: true },
  { code: "ZIP_P_9076_K", name: "든든한 어린이 식단", description: "어린이 맞춤 프리미엄 식단", category: "kids", isActive: true },
  { code: "ZIP_P_9076_Y", name: "든든한 유아 식단", description: "유아 맞춤 프리미엄 식단", category: "kids", isActive: true },
  { code: "ZIP_P_9077", name: "실속 식단", description: "합리적인 가격의 기본 식단", category: "standard", isActive: true },
  { code: "ZIP_P_9078", name: "든든한 가족 식단", description: "온 가족이 즐기는 프리미엄 식단", category: "family", isActive: true },
  { code: "ZIP_P_9080", name: "첫만남 식단", description: "첫만남 고객 환영 식단", category: "special", isActive: true },
  { code: "ZIP_P_9175", name: "시니어 식단", description: "시니어 기본 식단", category: "senior", isActive: true },
  { code: "ZIP_P_9346", name: "골고루 반찬 식단", description: "다양한 반찬 중심 식단", category: "side", isActive: true },
  { code: "ZIP_P_9476", name: "가족 식단", description: "가족 기본 식단", category: "family", isActive: true },
  { code: "ZIP_P_9478", name: "아이 식단", description: "아이 기본 식단", category: "kids", isActive: true },
  { code: "ZIP_P_9478_K", name: "어린이 식단", description: "어린이 기본 식단", category: "kids", isActive: true },
  { code: "ZIP_P_9478_Y", name: "유아 식단", description: "유아 기본 식단", category: "kids", isActive: true },
  { code: "ZIP_P_9502", name: "청소연구소 메인 식단", description: "청소연구소 메인 메뉴", category: "special", isActive: true },
  { code: "ZIP_P_9548", name: "건강한 시니어 식단", description: "시니어 맞춤 프리미엄 건강 식단", category: "senior", isActive: true },
  { code: "ZIP_P_9558", name: "청소연구소 식단", description: "청소연구소 전용 식단", category: "special", isActive: true },
]

function item(zipCode: string, productName: string, weight = "", quantity = 1): MealPlanItem {
  return { zipCode, productName, weight, quantity }
}

// 샘플 구성품 데이터
const SAMPLE_ITEMS_A: MealPlanItem[] = [
  item("ZIP_P_0092", "소불고기"), item("ZIP_P_0100", "된장찌개"), item("ZIP_P_1057", "깍두기"),
  item("ZIP_P_2046", "계란말이"), item("ZIP_P_4041", "시금치나물"), item("ZIP_P_5082", "두부조림"),
  item("ZIP_P_5100", "어묵볶음"), item("ZIP_P_6009", "잡채"),
]
const SAMPLE_ITEMS_B: MealPlanItem[] = [
  item("ZIP_P_0146", "닭갈비"), item("ZIP_P_1043", "미역국"), item("ZIP_P_2049", "배추김치"),
  item("ZIP_P_5178", "멸치볶음"), item("ZIP_P_6001", "호박나물"), item("ZIP_P_6120", "감자조림"),
  item("ZIP_P_6214", "콩나물무침"), item("ZIP_P_6342", "무생채"),
]
const SAMPLE_ITEMS_C: MealPlanItem[] = [
  item("ZIP_P_0094", "제육볶음"), item("ZIP_P_0139", "순두부찌개"), item("ZIP_P_2056", "총각김치"),
  item("ZIP_P_2059", "열무김치"), item("ZIP_P_5079", "고구마맛탕"), item("ZIP_P_5098", "브로콜리무침"),
  item("ZIP_P_6222", "마늘종볶음"), item("ZIP_P_6231", "오이무침"),
]

function makeDmp(id: string, date: string, mealPlanCode: string, mealPlanName: string, items: MealPlanItem[]): DailyMealPlan {
  return { id, date, mealPlanCode, mealPlanName, items, syncStatus: "synced", createdAt: "2026-04-28T09:00:00", updatedAt: "2026-04-28T09:00:00" }
}

// 2026년 6월 아이식단 샘플
export const MOCK_DAILY_MEAL_PLANS: DailyMealPlan[] = [
  makeDmp("dmp-001", "2026-06-02", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-002", "2026-06-03", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-003", "2026-06-04", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-004", "2026-06-05", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-005", "2026-06-06", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-006", "2026-06-09", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-007", "2026-06-10", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-008", "2026-06-11", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-009", "2026-06-12", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-010", "2026-06-13", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-011", "2026-06-16", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-012", "2026-06-17", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-013", "2026-06-18", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-014", "2026-06-19", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-015", "2026-06-20", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-016", "2026-06-23", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-017", "2026-06-24", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-018", "2026-06-25", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-019", "2026-06-26", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-020", "2026-06-27", "ZIP_P_9076", "든든한 아이 식단", SAMPLE_ITEMS_B),
  // 실속 식단
  makeDmp("dmp-101", "2026-06-02", "ZIP_P_9077", "실속 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-102", "2026-06-03", "ZIP_P_9077", "실속 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-103", "2026-06-04", "ZIP_P_9077", "실속 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-104", "2026-06-09", "ZIP_P_9077", "실속 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-105", "2026-06-10", "ZIP_P_9077", "실속 식단", SAMPLE_ITEMS_C),
  // 시니어 식단
  makeDmp("dmp-201", "2026-06-03", "ZIP_P_9175", "시니어 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-202", "2026-06-04", "ZIP_P_9175", "시니어 식단", SAMPLE_ITEMS_B),
  makeDmp("dmp-203", "2026-06-05", "ZIP_P_9175", "시니어 식단", SAMPLE_ITEMS_C),
  makeDmp("dmp-204", "2026-06-10", "ZIP_P_9175", "시니어 식단", SAMPLE_ITEMS_A),
  makeDmp("dmp-205", "2026-06-11", "ZIP_P_9175", "시니어 식단", SAMPLE_ITEMS_B),
]
