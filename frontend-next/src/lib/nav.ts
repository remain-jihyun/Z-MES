export const navItems = [
  {
    title: "대시보드",
    items: [
      { title: "생산통계", href: "/dashboard/stats" },
      { title: "현장관제", href: "/dashboard/field" },
      { title: "사무실관제", href: "/dashboard/office" },
    ],
  },
  {
    title: "생산계획 PULL",
    items: [
      { title: "1단계: 주문", href: "/production/order" },
      { title: "2단계: 전개", href: "/production/expansion" },
      { title: "3단계: 간반", href: "/production/kanban" },
      { title: "4단계: 생산", href: "/production/execute" },
      { title: "5단계: 완료", href: "/production/close" },
      { title: "추가생산", href: "/production/extra" },
      { title: "추가불출", href: "/production/extra-material" },
    ],
  },
  {
    title: "생산계획 PUSH",
    items: [
      { title: "주간 생산계획", href: "/push/weekly" },
      { title: "생산실행", href: "/push/execute" },
    ],
  },
  {
    title: "불량관리",
    items: [
      { title: "폐기", href: "/quality/waste" },
      { title: "미출/과생산", href: "/quality/deviation" },
    ],
  },
  {
    title: "재고관리",
    items: [
      { title: "입고", href: "/inventory/receiving" },
      { title: "재고실사", href: "/inventory/inspection" },
      { title: "재고현황", href: "/inventory/status" },
    ],
  },
  {
    title: "발주관리",
    items: [
      { title: "AI 수요예측", href: "/order/forecast" },
      { title: "발주서", href: "/order/purchase" },
      { title: "예측 피드백", href: "/order/feedback" },
    ],
  },
  {
    title: "설비관리",
    items: [
      { title: "설비현황", href: "/equipment/status" },
      { title: "HACCP 설비", href: "/equipment/haccp" },
      { title: "보전관리", href: "/equipment/maintenance" },
      { title: "수리/부품 이력", href: "/equipment/repair" },
    ],
  },
  {
    title: "이력추적",
    items: [
      { title: "로트 관리", href: "/trace/lot" },
      { title: "소비기한 관리", href: "/trace/expiry" },
      { title: "양방향 추적", href: "/trace/bidirectional" },
    ],
  },
  {
    title: "기초정보",
    items: [
      { title: "품목 DB", href: "/master/products" },
      { title: "정기식단 DB", href: "/master/menu" },
      { title: "BOM", href: "/master/bom" },
      { title: "BOP", href: "/master/bop" },
      { title: "거래처", href: "/master/partners" },
      { title: "발주 설정", href: "/master/order-settings" },
      { title: "유형관리", href: "/master/types" },
      { title: "수율", href: "/master/yield" },
      { title: "도미노 TTO", href: "/master/domino" },
    ],
  },
  {
    title: "시스템 관리",
    items: [
      { title: "NFC 태그", href: "/system/nfc" },
      { title: "디바이스 등록", href: "/system/device" },
    ],
  },
  {
    title: "개발",
    items: [
      { title: "수정 이력", href: "/changelog" },
    ],
  },
];
