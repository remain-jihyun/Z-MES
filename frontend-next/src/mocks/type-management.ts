import type { Temperature, Space, Process } from "@/types/type-management"

// ── 온도 유형 (6건) ──

export const mockTemperatures: Temperature[] = [
  { id: "TEMP-001", name: "냉각", thresholdType: "BELOW", minValue: null, maxValue: 15, description: "냉각실 기준온도", sortOrder: 1 },
  { id: "TEMP-002", name: "냉동", thresholdType: "BELOW", minValue: null, maxValue: -18, description: "냉동창고 기준온도", sortOrder: 2 },
  { id: "TEMP-003", name: "냉장", thresholdType: "RANGE", minValue: 0, maxValue: 10, description: "냉장창고 기준온도", sortOrder: 3 },
  { id: "TEMP-004", name: "냉장(해동)", thresholdType: "RANGE", minValue: 0, maxValue: 5, description: "냉장창고(해동) 기준온도", sortOrder: 4 },
  { id: "TEMP-005", name: "상온", thresholdType: "BELOW", minValue: null, maxValue: 35, description: "상온 온도기준", sortOrder: 5 },
  { id: "TEMP-006", name: "포장", thresholdType: "BELOW", minValue: null, maxValue: 15, description: "포장실(내포장, 외포장) 기준온도", sortOrder: 6 },
]

// ── 공간 목록 ──

export const mockSpaces: Space[] = [
  // 지하층
  { id: "SPC-001", name: "상온창고 - 지하B", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "지하층", temperatureId: "TEMP-005", temperatureName: "상온", sortOrder: 1 },
  { id: "SPC-002", name: "냉동창고 - 지하B실", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "지하층", temperatureId: "TEMP-002", temperatureName: "냉동", sortOrder: 2 },
  { id: "SPC-003", name: "냉동창고(건식품) - 지하B실", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 2, floor: "지하층", temperatureId: "TEMP-002", temperatureName: "냉동", sortOrder: 3 },
  { id: "SPC-004", name: "냉동창고(구냉동) - 지하B실", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 2, floor: "지하층", temperatureId: "TEMP-002", temperatureName: "냉동", sortOrder: 4 },
  { id: "SPC-005", name: "상온창고 - 불출실", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "지하층", temperatureId: "TEMP-005", temperatureName: "상온", sortOrder: 5 },
  { id: "SPC-006", name: "냉장창고 - 불출실", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "지하층", temperatureId: "TEMP-003", temperatureName: "냉장", sortOrder: 6 },
  { id: "SPC-007", name: "냉동창고 - 불출실", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "지하층", temperatureId: "TEMP-002", temperatureName: "냉동", sortOrder: 7 },
  // 2층
  { id: "SPC-008", name: "전처리실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 1 },
  { id: "SPC-009", name: "수산/채소실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 2 },
  { id: "SPC-010", name: "조리실", spaceType: "WORKSHOP", cleanZone: "SEMI_CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 3 },
  { id: "SPC-011", name: "소스/건식", spaceType: "WORKSHOP", cleanZone: "SEMI_CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 4 },
  { id: "SPC-012", name: "세포장실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-001", temperatureName: "냉각", sortOrder: 5 },
  { id: "SPC-013", name: "방열실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-001", temperatureName: "냉각", sortOrder: 6 },
  { id: "SPC-014", name: "냉장창고 - 내포장실", spaceType: "WAREHOUSE", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-003", temperatureName: "냉장", sortOrder: 7 },
  { id: "SPC-015", name: "냉각실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-001", temperatureName: "냉각", sortOrder: 8 },
  { id: "SPC-016", name: "내포장실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 9 },
  { id: "SPC-017", name: "외포장실", spaceType: "WORKSHOP", cleanZone: "SEMI_CLEAN", depth: 2, floor: "2층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 10 },
  { id: "SPC-018", name: "불출실", spaceType: "WORKSHOP", cleanZone: "GENERAL", depth: 2, floor: "2층", temperatureId: "TEMP-005", temperatureName: "상온", sortOrder: 11 },
  // 3층
  { id: "SPC-019", name: "국전류실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "3층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 1 },
  { id: "SPC-020", name: "상온창고 - 3층", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "3층", temperatureId: "TEMP-005", temperatureName: "상온", sortOrder: 2 },
  { id: "SPC-021", name: "국전류 포장실", spaceType: "WORKSHOP", cleanZone: "CLEAN", depth: 2, floor: "3층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 3 },
  { id: "SPC-022", name: "출고", spaceType: "WORKSHOP", cleanZone: "GENERAL", depth: 1, floor: "3층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 4 },
  { id: "SPC-023", name: "냉동창고 - 2", spaceType: "WAREHOUSE", cleanZone: "GENERAL", depth: 1, floor: "3층", temperatureId: "TEMP-002", temperatureName: "냉동", sortOrder: 5 },
  { id: "SPC-024", name: "스스", spaceType: "WORKSHOP", cleanZone: "GENERAL", depth: 1, floor: "3층", temperatureId: "TEMP-006", temperatureName: "포장", sortOrder: 6 },
]

// ── 공정 목록 ──

export const mockProcesses: Process[] = [
  // 전처리실 (6건)
  { id: "PRC-001", name: "전전처리", spaceId: "SPC-008", spaceName: "전처리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  { id: "PRC-002", name: "가열", spaceId: "SPC-008", spaceName: "전처리실", isCcp: true, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 2 },
  { id: "PRC-003", name: "소독/세정금", spaceId: "SPC-008", spaceName: "전처리실", isCcp: true, isInspection: false, isCooling: true, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 3 },
  { id: "PRC-004", name: "전처리 - 야채류", spaceId: "SPC-008", spaceName: "전처리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 4 },
  { id: "PRC-005", name: "전처리 - 수산/육류", spaceId: "SPC-008", spaceName: "전처리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 5 },
  { id: "PRC-006", name: "전처리 - 검수", spaceId: "SPC-008", spaceName: "전처리실", isCcp: false, isInspection: true, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 6 },
  // 조리실 (8건)
  { id: "PRC-007", name: "조리 - 무침", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  { id: "PRC-008", name: "조리 - 전", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 2 },
  { id: "PRC-009", name: "조리 - 눌은레인지", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 3 },
  { id: "PRC-010", name: "조리 - 국솥", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 4 },
  { id: "PRC-011", name: "조리 - 인덕션 국솥", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 5 },
  { id: "PRC-012", name: "조리 - 튀김기", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 6 },
  { id: "PRC-013", name: "조리 - 오븐", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 7 },
  { id: "PRC-014", name: "조리 - 검수", spaceId: "SPC-010", spaceName: "조리실", isCcp: false, isInspection: true, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 8 },
  // 내포장실 (9건)
  { id: "PRC-015", name: "내포장 - 소용량", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  { id: "PRC-016", name: "내포장 - 대용량", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 2 },
  { id: "PRC-017", name: "내포장 - 멀티팩", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 3 },
  { id: "PRC-032", name: "실링 - 소용량", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 4 },
  { id: "PRC-018", name: "실링 - 멀티팩", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 5 },
  { id: "PRC-019", name: "실링 - 대용량", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 6 },
  { id: "PRC-020", name: "내포장 - 소용량/대용량 - 검수", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: true, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 7 },
  { id: "PRC-021", name: "중량선별기", spaceId: "SPC-016", spaceName: "내포장실", isCcp: false, isInspection: true, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 8 },
  { id: "PRC-022", name: "금속검출기", spaceId: "SPC-016", spaceName: "내포장실", isCcp: true, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 9 },
  // 방열실 (1건)
  { id: "PRC-023", name: "방열", spaceId: "SPC-013", spaceName: "방열실", isCcp: false, isInspection: false, isCooling: true, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  // 냉각실 (1건)
  { id: "PRC-024", name: "냉각", spaceId: "SPC-015", spaceName: "냉각실", isCcp: false, isInspection: false, isCooling: true, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  // 외포장실 (4건)
  { id: "PRC-025", name: "정리", spaceId: "SPC-017", spaceName: "외포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  { id: "PRC-026", name: "피킹", spaceId: "SPC-017", spaceName: "외포장실", isCcp: false, isInspection: true, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 2 },
  { id: "PRC-027", name: "패킹", spaceId: "SPC-017", spaceName: "외포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 3 },
  { id: "PRC-028", name: "출고", spaceId: "SPC-017", spaceName: "외포장실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 4 },
  // 불출실 (3건)
  { id: "PRC-029", name: "자재 입고", spaceId: "SPC-018", spaceName: "불출실", isCcp: false, isInspection: true, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 1 },
  { id: "PRC-030", name: "자재 불출 - 전기호출", spaceId: "SPC-018", spaceName: "불출실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 2 },
  { id: "PRC-031", name: "자재 불출 - 통합 불출", spaceId: "SPC-018", spaceName: "불출실", isCcp: false, isInspection: false, isCooling: false, createKanban: true, deviceId: null, equipmentName: null, description: null, sortOrder: 3 },
]
