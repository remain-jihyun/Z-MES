// Mock data for MES frontend prototype

export const mockKanbanStats = {
  total: 48,
  completed: 31,
  inProgress: 10,
  waiting: 7,
  rate: 64.6,
};

export const mockKanbans = [
  { id: "A-20260602-001", team: "1반", product: "닭갈비", qty: 200, unit: "팩", process: "전처리", status: "완료" as const, assignee: "김철수", startTime: "08:00", endTime: "09:30", progress: 100 },
  { id: "A-20260602-002", team: "1반", product: "제육볶음", qty: 150, unit: "팩", process: "조리", status: "진행" as const, assignee: "이영희", startTime: "09:00", endTime: null, progress: 65 },
  { id: "B-20260602-001", team: "2반", product: "시금치나물", qty: 300, unit: "팩", process: "전처리", status: "완료" as const, assignee: "박민준", startTime: "07:30", endTime: "08:45", progress: 100 },
  { id: "B-20260602-002", team: "2반", product: "콩자반", qty: 250, unit: "팩", process: "조리", status: "진행" as const, assignee: "최지원", startTime: "08:45", endTime: null, progress: 40 },
  { id: "C-20260602-001", team: "3반", product: "잡채", qty: 180, unit: "팩", process: "포장", status: "완료" as const, assignee: "정수진", startTime: "10:00", endTime: "11:00", progress: 100 },
  { id: "C-20260602-002", team: "3반", product: "된장찌개", qty: 120, unit: "팩", process: "전처리", status: "대기" as const, assignee: "한동훈", startTime: null, endTime: null, progress: 0 },
  { id: "D-20260602-001", team: "4반", product: "무생채", qty: 200, unit: "팩", process: "조리", status: "완료" as const, assignee: "오세훈", startTime: "08:30", endTime: "09:45", progress: 100 },
  { id: "D-20260602-002", team: "4반", product: "어묵볶음", qty: 160, unit: "팩", process: "포장", status: "진행" as const, assignee: "임나경", startTime: "09:30", endTime: null, progress: 75 },
];

export const mockHaccpData = {
  temperature: 4.2,
  humidity: 62,
  ccpValue: 3.8,
  ccpStandard: { min: 0, max: 5 },
  isAlert: false,
  lastUpdated: "2026-06-02 14:23",
  history: [
    { time: "08:00", temp: 3.9, humidity: 61 },
    { time: "09:00", temp: 4.1, humidity: 63 },
    { time: "10:00", temp: 4.3, humidity: 62 },
    { time: "11:00", temp: 4.5, humidity: 64 },
    { time: "12:00", temp: 4.2, humidity: 62 },
    { time: "13:00", temp: 4.0, humidity: 61 },
    { time: "14:00", temp: 4.2, humidity: 62 },
  ],
};

export const mockOrders = [
  { id: "ORD-2026-001", productCode: "P-001", productName: "닭갈비", spec: "200g", unit: "팩", qty: 500, channel: "쿠팡", order: 1 },
  { id: "ORD-2026-002", productCode: "P-002", productName: "제육볶음", spec: "200g", unit: "팩", qty: 350, channel: "컬리", order: 2 },
  { id: "ORD-2026-003", productCode: "P-003", productName: "시금치나물", spec: "150g", unit: "팩", qty: 600, channel: "자사몰", order: 3 },
  { id: "ORD-2026-004", productCode: "P-004", productName: "콩자반", spec: "150g", unit: "팩", qty: 400, channel: "스마트스토어", order: 4 },
  { id: "ORD-2026-005", productCode: "P-005", productName: "잡채", spec: "250g", unit: "팩", qty: 280, channel: "쿠팡", order: 5 },
];

export const mockExpansion = [
  { rawCode: "RM-001", localCode: "LC-001", name: "닭고기", preYield: 85, coolYield: 92, packYield: 98, convertedQty: 612 },
  { rawCode: "RM-002", localCode: "LC-002", name: "돼지고기", preYield: 88, coolYield: 91, packYield: 97, convertedQty: 425 },
  { rawCode: "RM-003", localCode: "LC-003", name: "시금치", preYield: 72, coolYield: 95, packYield: 99, convertedQty: 883 },
  { rawCode: "RM-004", localCode: "LC-004", name: "콩", preYield: 95, coolYield: 98, packYield: 99, convertedQty: 427 },
];

export const mockInventory = [
  { code: "RM-001", name: "닭고기", location: "냉장창고 A", qty: 150, unit: "kg", expiry: "2026-06-05", status: "임박" as const },
  { code: "RM-002", name: "돼지고기", location: "냉장창고 A", qty: 80, unit: "kg", expiry: "2026-06-08", status: "정상" as const },
  { code: "RM-003", name: "시금치", location: "냉장창고 B", qty: 30, unit: "kg", expiry: "2026-06-03", status: "임박" as const },
  { code: "RM-004", name: "콩", location: "상온창고", qty: 200, unit: "kg", expiry: "2026-12-31", status: "정상" as const },
  { code: "RM-005", name: "양파", location: "상온창고", qty: 120, unit: "kg", expiry: "2026-07-15", status: "정상" as const },
  { code: "RM-006", name: "당근", location: "냉장창고 B", qty: 5, unit: "kg", expiry: "2026-06-02", status: "초과" as const },
  { code: "RM-007", name: "대파", location: "냉장창고 B", qty: 40, unit: "kg", expiry: "2026-06-10", status: "정상" as const },
  { code: "RM-008", name: "마늘", location: "상온창고", qty: 60, unit: "kg", expiry: "2026-08-20", status: "정상" as const },
];

export const mockProducts = [
  { code: "P-001", name: "닭갈비", type: "반찬", unit: "팩", weight: 200, storage: "냉장", inPrice: 1800, salePrice: 3500, supplier: "식자재㈜", active: true },
  { code: "P-002", name: "제육볶음", type: "반찬", unit: "팩", weight: 200, storage: "냉장", inPrice: 2200, salePrice: 4200, supplier: "식자재㈜", active: true },
  { code: "P-003", name: "시금치나물", type: "나물", unit: "팩", weight: 150, storage: "냉장", inPrice: 800, salePrice: 2000, supplier: "채소농원", active: true },
  { code: "P-004", name: "콩자반", type: "콩류", unit: "팩", weight: 150, storage: "냉장", inPrice: 1200, salePrice: 2500, supplier: "두부농원", active: true },
  { code: "P-005", name: "잡채", type: "반찬", unit: "팩", weight: 250, storage: "냉장", inPrice: 2500, salePrice: 4800, supplier: "식자재㈜", active: false },
];

export const mockBom = [
  { productCode: "P-001", productName: "닭갈비", materialCode: "RM-001", materialName: "닭고기", unit: "g", qty: 180, bomType: "반제품", validFrom: "2026-01-01", validTo: "2026-12-31" },
  { productCode: "P-001", productName: "닭갈비", materialCode: "RM-005", materialName: "양파", unit: "g", qty: 30, bomType: "반제품", validFrom: "2026-01-01", validTo: "2026-12-31" },
  { productCode: "P-002", productName: "제육볶음", materialCode: "RM-002", materialName: "돼지고기", unit: "g", qty: 180, bomType: "반제품", validFrom: "2026-01-01", validTo: "2026-12-31" },
  { productCode: "P-003", productName: "시금치나물", materialCode: "RM-003", materialName: "시금치", unit: "g", qty: 130, bomType: "완제품", validFrom: "2026-01-01", validTo: "2026-12-31" },
];

export const mockWorkers = [
  { code: "W-001", name: "김철수", team: "1반", role: "반장" },
  { code: "W-002", name: "이영희", team: "1반", role: "작업자" },
  { code: "W-003", name: "박민준", team: "2반", role: "반장" },
  { code: "W-004", name: "최지원", team: "2반", role: "작업자" },
  { code: "W-005", name: "정수진", team: "3반", role: "반장" },
  { code: "W-006", name: "한동훈", team: "3반", role: "작업자" },
];

export const mockSuppliers = [
  { code: "S-001", name: "식자재㈜", contact: "홍길동", phone: "02-1234-5678" },
  { code: "S-002", name: "채소농원", contact: "김농부", phone: "031-9876-5432" },
  { code: "S-003", name: "두부농원", contact: "이두부", phone: "033-5555-1234" },
];

export const mockPurchaseOrders = [
  { id: "PO-20260601-001", date: "2026-06-01", supplier: "식자재㈜", material: "닭고기", qty: 200, unit: "kg", unitPrice: 8500, dueDate: "2026-06-03", status: "승인" as const, approver: "관리자" },
  { id: "PO-20260601-002", date: "2026-06-01", supplier: "채소농원", material: "시금치", qty: 80, unit: "kg", unitPrice: 3200, dueDate: "2026-06-02", status: "대기" as const, approver: null },
  { id: "PO-20260602-001", date: "2026-06-02", supplier: "식자재㈜", material: "돼지고기", qty: 150, unit: "kg", unitPrice: 12000, dueDate: "2026-06-04", status: "대기" as const, approver: null },
];

export const mockWasteRecords = [
  { id: "W-001", datetime: "2026-06-02 09:00", type: "전처리", code: "RM-001", name: "닭고기", qty: 5, unit: "kg", reason: "변색", assignee: "김철수" },
  { id: "W-002", datetime: "2026-06-02 10:30", type: "원재료", code: "RM-003", name: "시금치", qty: 3, unit: "kg", reason: "부패", assignee: "박민준" },
  { id: "W-003", datetime: "2026-06-01 14:00", type: "조리", code: "P-002", name: "제육볶음", qty: 20, unit: "팩", reason: "조리 실패", assignee: "이영희" },
];

export const mockYield = [
  { code: "P-001", name: "닭갈비", process: "전처리", yieldRate: 85, stdWeight: 200, lossWeight: 30, appliedDate: "2026-01-01" },
  { code: "P-001", name: "닭갈비", process: "냉각", yieldRate: 92, stdWeight: 170, lossWeight: 13.6, appliedDate: "2026-01-01" },
  { code: "P-001", name: "닭갈비", process: "포장", yieldRate: 98, stdWeight: 156.4, lossWeight: 3.1, appliedDate: "2026-01-01" },
  { code: "P-002", name: "제육볶음", process: "전처리", yieldRate: 88, stdWeight: 200, lossWeight: 24, appliedDate: "2026-01-01" },
  { code: "P-002", name: "제육볶음", process: "냉각", yieldRate: 91, stdWeight: 176, lossWeight: 15.8, appliedDate: "2026-01-01" },
];

export const mockLots = [
  { lot: "P001-20260602-001", product: "P-001", name: "닭갈비", productionDate: "2026-06-02", qty: 200, rawLots: ["LOT-RM-001-0530", "LOT-RM-005-0601"], processes: ["전처리 08:00", "조리 09:30", "포장 11:00"] },
  { lot: "P002-20260602-001", product: "P-002", name: "제육볶음", productionDate: "2026-06-02", qty: 150, rawLots: ["LOT-RM-002-0601"], processes: ["전처리 09:00", "조리 10:30"] },
];

export const mockDevices = [
  { id: "DEV-001", type: "공용 간반 출력용", assignee: null, location: "1반 작업장", registeredAt: "2026-01-10", status: "활성" as const },
  { id: "DEV-002", type: "반장 개별 지급용", assignee: "김철수", location: "1반 반장", registeredAt: "2026-01-10", status: "활성" as const },
  { id: "DEV-003", type: "반장 개별 지급용", assignee: "박민준", location: "2반 반장", registeredAt: "2026-01-15", status: "활성" as const },
  { id: "DEV-004", type: "사무직용", assignee: "관리자", location: "사무실", registeredAt: "2026-01-10", status: "활성" as const },
  { id: "DEV-005", type: "공용 간반 출력용", assignee: null, location: "3반 작업장", registeredAt: "2026-02-01", status: "비활성" as const },
];

// --- Additional mock data for remaining screens ---

export const mockExtraProduction = [
  { id: "EP-001", datetime: "2026-06-02 09:15", productCode: "P-001", productName: "닭갈비", addQty: 50, unit: "팩", method: "수정", reason: "추가 주문 발생", status: "승인" as const },
  { id: "EP-002", datetime: "2026-06-02 10:40", productCode: "P-003", productName: "시금치나물", addQty: 100, unit: "팩", method: "교체", reason: "간반 출력 후 주문 변경", status: "대기" as const },
];

export const mockExtraMaterial = [
  { id: "EM-001", datetime: "2026-06-02 08:55", kanbanId: "A-20260602-002", materialCode: "RM-001", materialName: "닭고기", stdQty: 180, addQty: 20, unit: "g", requester: "이영희" },
  { id: "EM-002", datetime: "2026-06-02 10:10", kanbanId: "B-20260602-002", materialCode: "RM-008", materialName: "마늘", stdQty: 30, addQty: 10, unit: "g", requester: "최지원" },
];

export const mockWeeklyPlan = [
  { week: "2026-W23", productCode: "P-001", productName: "닭갈비", planQty: 2500, confirmedQty: null, status: "작성중" as const, author: "관리자" },
  { week: "2026-W23", productCode: "P-002", productName: "제육볶음", planQty: 1800, confirmedQty: null, status: "작성중" as const, author: "관리자" },
  { week: "2026-W23", productCode: "P-003", productName: "시금치나물", planQty: 3000, confirmedQty: 3000, status: "확정" as const, author: "관리자" },
  { week: "2026-W23", productCode: "P-004", productName: "콩자반", planQty: 2000, confirmedQty: 2000, status: "확정" as const, author: "관리자" },
];

export const mockPushExecute = [
  { id: "PE-001", date: "2026-06-02", productCode: "P-003", productName: "시금치나물", planQty: 3000, execQty: 2850, assignee: "정수진", status: "완료" as const },
  { id: "PE-002", date: "2026-06-02", productCode: "P-004", productName: "콩자반", planQty: 2000, execQty: 1950, assignee: "최지원", status: "완료" as const },
  { id: "PE-003", date: "2026-06-03", productCode: "P-001", productName: "닭갈비", planQty: 2500, execQty: 0, assignee: "김철수", status: "대기" as const },
];

export const mockDeviation = [
  { id: "DV-001", datetime: "2026-06-02 11:30", type: "미출", productCode: "P-001", productName: "닭갈비", stdQty: 200, actualQty: 185, diffQty: -15, reason: "포장 불량", assignee: "김철수" },
  { id: "DV-002", datetime: "2026-06-02 12:15", type: "과생산", productCode: "P-003", productName: "시금치나물", stdQty: 300, actualQty: 320, diffQty: 20, reason: "원재료 소진", assignee: "박민준" },
  { id: "DV-003", datetime: "2026-06-01 14:00", type: "미출", productCode: "P-004", productName: "콩자반", stdQty: 250, actualQty: 238, diffQty: -12, reason: "조리 손실 초과", assignee: "최지원" },
];

export const mockReceiving = [
  { id: "RC-001", date: "2026-06-02", materialCode: "RM-001", materialName: "닭고기", qty: 100, unit: "kg", expiry: "2026-06-05", supplier: "식자재㈜", inspector: "관리자", barcode: "8801234567890" },
  { id: "RC-002", date: "2026-06-02", materialCode: "RM-002", materialName: "돼지고기", qty: 80, unit: "kg", expiry: "2026-06-07", supplier: "식자재㈜", inspector: "관리자", barcode: "8809876543210" },
  { id: "RC-003", date: "2026-06-01", materialCode: "RM-003", materialName: "시금치", qty: 50, unit: "kg", expiry: "2026-06-03", supplier: "채소농원", inspector: "관리자", barcode: "" },
];

export const mockInspection = [
  { materialCode: "RM-001", materialName: "닭고기", location: "냉장A", bookQty: 150, firstQty: 148, secondQty: 148, diff: -2, inspector: "박민준", date: "2026-06-02" },
  { materialCode: "RM-002", materialName: "돼지고기", location: "냉장A", bookQty: 80, firstQty: 80, secondQty: 80, diff: 0, inspector: "박민준", date: "2026-06-02" },
  { materialCode: "RM-003", materialName: "시금치", location: "냉장B", bookQty: 30, firstQty: 27, secondQty: null, diff: null, inspector: "정수진", date: "2026-06-02" },
  { materialCode: "RM-004", materialName: "콩", location: "상온", bookQty: 200, firstQty: 198, secondQty: 198, diff: -2, inspector: "최지원", date: "2026-06-02" },
  { materialCode: "RM-005", materialName: "양파", location: "상온", bookQty: 120, firstQty: 120, secondQty: 120, diff: 0, inspector: "최지원", date: "2026-06-02" },
];

export const mockForecast = [
  { materialCode: "RM-001", materialName: "닭고기", basisDate: "2026-06-05", coupang: 120, kurly: 80, own: 30, subscription: 20, forecastQty: 280, safeStock: 50, leadTime: 2, zValue: 1.65 },
  { materialCode: "RM-002", materialName: "돼지고기", basisDate: "2026-06-05", coupang: 90, kurly: 60, own: 20, subscription: 10, forecastQty: 200, safeStock: 40, leadTime: 2, zValue: 1.65 },
  { materialCode: "RM-003", materialName: "시금치", basisDate: "2026-06-05", coupang: 60, kurly: 40, own: 30, subscription: 15, forecastQty: 160, safeStock: 30, leadTime: 1, zValue: 1.65 },
];

export const mockForecastFeedback = [
  { id: "FB-001", datetime: "2026-06-02 07:00", materialCode: "RM-003", materialName: "시금치", shortage: 30, unit: "kg", isUrgent: true, feedback: "즉시 발주 필요" },
  { id: "FB-002", datetime: "2026-06-01 07:00", materialCode: "RM-001", materialName: "닭고기", shortage: 10, unit: "kg", isUrgent: false, feedback: "다음 발주 시 포함" },
];

export const mockEquipments = [
  { code: "EQ-001", name: "진공포장기 1호", location: "포장실",   installedAt: "2022-03-15", maker: "대양기계", model: "DY-VP100",  status: "정상"  as const, heatPerHour: 1.2,  heatUnit: "kcal/h" as const, moisturePerHour: 0.3 },
  { code: "EQ-002", name: "진공포장기 2호", location: "포장실",   installedAt: "2022-03-15", maker: "대양기계", model: "DY-VP100",  status: "정상"  as const, heatPerHour: 1.2,  heatUnit: "kcal/h" as const, moisturePerHour: 0.3 },
  { code: "EQ-003", name: "급속냉동기",     location: "냉동실",   installedAt: "2021-08-01", maker: "삼성냉동", model: "SF-Q200",   status: "점검중" as const, heatPerHour: 5800, heatUnit: "W"      as const, moisturePerHour: 1.2 },
  { code: "EQ-004", name: "조리솥 1호",     location: "조리실",   installedAt: "2020-05-20", maker: "한국산업", model: "HK-P50",    status: "정상"  as const, heatPerHour: 12.5, heatUnit: "kcal/h" as const, moisturePerHour: 4.8 },
  { code: "EQ-005", name: "세척기",         location: "전처리실", installedAt: "2023-01-10", maker: "클린텍",   model: "CT-WM30",   status: "고장"  as const, heatPerHour: 2100, heatUnit: "W"      as const, moisturePerHour: 8.5 },
];

export const mockHaccpEquipments = [
  { code: "EQ-001", name: "진공포장기 1호", ccpValue: 3.8, ccpMin: 0, ccpMax: 5, humidity: 62, checkDate: "2026-06-01", alertHistory: [] },
  { code: "EQ-003", name: "급속냉동기", ccpValue: -18.2, ccpMin: -25, ccpMax: -15, humidity: 85, checkDate: "2026-05-30", alertHistory: [{ time: "2026-05-28 14:00", value: -14.8 }] },
];

export const mockMaintenance = [
  { code: "EQ-001", equipName: "진공포장기 1호", cycle: 30, lastCheck: "2026-05-15", nextCheck: "2026-06-14", inspector: "김철수", result: "이상없음", status: "정상" as const },
  { code: "EQ-002", equipName: "진공포장기 2호", cycle: 30, lastCheck: "2026-04-10", nextCheck: "2026-05-10", inspector: "김철수", result: "오일 교체", status: "지연" as const },
  { code: "EQ-004", equipName: "조리솥 1호", cycle: 90, lastCheck: "2026-03-01", nextCheck: "2026-05-30", inspector: "박민준", result: "정상", status: "지연" as const },
];

export const mockRepairHistory = [
  { id: "RP-001", equipCode: "EQ-005", equipName: "세척기", occurDate: "2026-06-01", problem: "모터 과열 정지", repair: "팬 교체", part: "냉각팬", partCode: "CT-FAN-01", repairer: "외주업체A", cost: 150000 },
  { id: "RP-002", equipCode: "EQ-003", equipName: "급속냉동기", occurDate: "2026-05-28", problem: "온도 급상승", repair: "냉매 보충", part: null, partCode: null, repairer: "삼성냉동AS", cost: 80000 },
];

export const mockLotDetail = [
  {
    lot: "P001-20260602-001", product: "P-001", name: "닭갈비",
    productionDate: "2026-06-02", qty: 200, rawLots: ["LOT-RM-001-0530", "LOT-RM-005-0601"],
    processes: [
      { step: "전처리", time: "08:00", worker: "김철수", result: "정상" },
      { step: "조리", time: "09:30", worker: "이영희", result: "정상" },
      { step: "포장", time: "11:00", worker: "김철수", result: "정상" },
    ]
  },
  {
    lot: "P002-20260602-001", product: "P-002", name: "제육볶음",
    productionDate: "2026-06-02", qty: 150, rawLots: ["LOT-RM-002-0601"],
    processes: [
      { step: "전처리", time: "09:00", worker: "박민준", result: "정상" },
      { step: "조리", time: "10:30", worker: "최지원", result: "정상" },
    ]
  },
];

export const mockExpiry = [
  { materialCode: "RM-001", materialName: "닭고기", criterionDays: 3, currentExpiry: "2026-06-05", alertDate: "2026-06-02", status: "임박" as const },
  { materialCode: "RM-002", materialName: "돼지고기", criterionDays: 3, currentExpiry: "2026-06-08", alertDate: "2026-06-05", status: "정상" as const },
  { materialCode: "RM-003", materialName: "시금치", criterionDays: 2, currentExpiry: "2026-06-03", alertDate: "2026-06-01", status: "초과" as const },
  { materialCode: "RM-006", materialName: "당근", criterionDays: 2, currentExpiry: "2026-06-02", alertDate: "2026-05-31", status: "초과" as const },
  { materialCode: "RM-007", materialName: "대파", criterionDays: 3, currentExpiry: "2026-06-10", alertDate: "2026-06-07", status: "정상" as const },
];

export const mockMenuDB = [
  { code: "MN-001", name: "월요세트", weekday: "월", products: ["닭갈비", "시금치나물", "콩자반"], qty: 3, validFrom: "2026-06-01", validTo: "2026-08-31" },
  { code: "MN-002", name: "수요세트", weekday: "수", products: ["제육볶음", "무생채", "콩자반"], qty: 3, validFrom: "2026-06-01", validTo: "2026-08-31" },
  { code: "MN-003", name: "금요세트", weekday: "금", products: ["잡채", "시금치나물", "어묵볶음"], qty: 3, validFrom: "2026-06-01", validTo: "2026-08-31" },
];

export const mockBop = [
  { code: "BP-001", name: "전처리", type: "전처리", order: 1, nextProcess: "BP-002", workTime: 60, equipment: "세척기" },
  { code: "BP-002", name: "조리", type: "조리", order: 2, nextProcess: "BP-003", workTime: 90, equipment: "조리솥 1호" },
  { code: "BP-003", name: "냉각", type: "냉각", order: 3, nextProcess: "BP-004", workTime: 30, equipment: "급속냉동기" },
  { code: "BP-004", name: "포장", type: "포장", order: 4, nextProcess: null, workTime: 45, equipment: "진공포장기 1호" },
];

export const mockOrderSettings = [
  { materialCode: "RM-001", materialName: "닭고기", interval: 3, leadTime: 2, zValue: 1.65, serviceLevel: 95, minOrder: 50 },
  { materialCode: "RM-002", materialName: "돼지고기", interval: 3, leadTime: 2, zValue: 1.65, serviceLevel: 95, minOrder: 30 },
  { materialCode: "RM-003", materialName: "시금치", interval: 2, leadTime: 1, zValue: 1.28, serviceLevel: 90, minOrder: 20 },
  { materialCode: "RM-005", materialName: "양파", interval: 7, leadTime: 2, zValue: 1.28, serviceLevel: 90, minOrder: 50 },
];

export const mockTypes = [
  { code: "TP-001", category: "폐기", name: "전처리 폐기", description: "전처리 과정 폐기물", active: true },
  { code: "TP-002", category: "폐기", name: "조리 폐기", description: "조리 과정 폐기물", active: true },
  { code: "TP-003", category: "폐기", name: "원재료 폐기", description: "입고 불량 원재료", active: true },
  { code: "TP-004", category: "미출/과생산", name: "포장 미출", description: "외포장 공정 미출", active: true },
  { code: "TP-005", category: "미출/과생산", name: "과생산", description: "계획 초과 생산", active: true },
  { code: "TP-006", category: "공정", name: "전처리", description: "원재료 전처리 공정", active: true },
  { code: "TP-007", category: "공정", name: "조리", description: "조리 공정", active: true },
  { code: "TP-008", category: "공정", name: "포장", description: "포장 공정", active: false },
];

export const mockNfcTags = [
  { id: "NFC-001", target: "설비", targetRef: "EQ-001", task: "포장 시작/완료 스캔", registeredAt: "2026-01-10", status: "활성" as const },
  { id: "NFC-002", target: "설비", targetRef: "EQ-003", task: "냉동 완료 스캔", registeredAt: "2026-01-10", status: "활성" as const },
  { id: "NFC-003", target: "위치", targetRef: "냉장창고 A", task: "입고 확인 스캔", registeredAt: "2026-02-01", status: "활성" as const },
  { id: "NFC-004", target: "품목", targetRef: "P-001", task: "간반 시작 스캔", registeredAt: "2026-03-01", status: "비활성" as const },
];

export const mockDomino = [
  { deviceCode: "DM-001", product: "P-001", productName: "닭갈비", format: "소비기한+제품명+중량", status: "연결" as const },
  { deviceCode: "DM-002", product: "P-002", productName: "제육볶음", format: "소비기한+제품명+중량", status: "연결" as const },
  { deviceCode: "DM-003", product: "P-003", productName: "시금치나물", format: "소비기한+제품명", status: "오류" as const },
];
