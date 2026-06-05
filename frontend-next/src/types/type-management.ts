// ── 공간 유형 ──

export type SpaceType = "WORKSHOP" | "WAREHOUSE"

export const SPACE_TYPE_LABELS: Record<SpaceType, string> = {
  WORKSHOP: "작업장",
  WAREHOUSE: "창고",
}

// ── 청결구역 ──

export type CleanZone = "CLEAN" | "SEMI_CLEAN" | "GENERAL"

export const CLEAN_ZONE_LABELS: Record<CleanZone, string> = {
  CLEAN: "청결",
  SEMI_CLEAN: "준청결",
  GENERAL: "일반",
}

// ── 임계유형 ──

export type ThresholdType = "ABOVE" | "BELOW" | "RANGE"

export const THRESHOLD_TYPE_LABELS: Record<ThresholdType, string> = {
  ABOVE: "이상(≥)",
  BELOW: "이하(≤)",
  RANGE: "범위",
}

// ── 탭 ──

export type TypeManagementTab = "space" | "process" | "temperature" | "device"

// ── 온도 유형 ──

export interface Temperature {
  id: string
  name: string
  thresholdType: ThresholdType
  minValue: number | null
  maxValue: number | null
  description: string
  sortOrder: number
}

// ── 공간 ──

export interface Space {
  id: string
  name: string
  spaceType: SpaceType
  cleanZone: CleanZone
  depth: number
  floor: string
  temperatureId: string | null
  temperatureName: string | null
  sortOrder: number
}

// ── 공정 ──

export interface Process {
  id: string
  name: string
  spaceId: string
  spaceName: string
  isCcp: boolean
  isInspection: boolean
  isCooling: boolean
  createKanban: boolean
  deviceId: string | null
  equipmentName: string | null
  description: string | null
  sortOrder: number
}

// ── 온도 범위 표시 헬퍼 ──

export function formatTemperatureRange(t: Temperature): string {
  switch (t.thresholdType) {
    case "BELOW":
      return `≤ ${t.maxValue}°C`
    case "ABOVE":
      return `≥ ${t.minValue}°C`
    case "RANGE":
      return `${t.minValue}°C ~ ${t.maxValue}°C`
  }
}
