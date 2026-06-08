export interface ChangeItem {
  text: string
  type?: "new" | "fix" | "remove" | "improve"
}

export interface PageChangelog {
  page: string
  href: string
  section: string
  entries: { date: string; items: ChangeItem[] }[]
}

export const CHANGELOG: PageChangelog[] = [
  {
    page: "품목 DB",
    href: "/master/products",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "Z-MIS 연동 버튼 추가", type: "new" },
          { text: "초기화 버튼 → 필터 셀렉트 우측으로 이동 (왼쪽 영역)", type: "improve" },
          { text: "뷰어 전용으로 변경 — 추가/수정/삭제 불가 (MIS 메뉴로 이관)", type: "improve" },
          { text: "사용중단 품목 행에 삭제 버튼 추가 (삭제 확인 팝업 포함)", type: "new" },
          { text: "상태 필터 탭 → 셀렉트 박스로 변경, 품목코드 왼쪽으로 이동", type: "improve" },
          { text: "기본 상태 필터 '전체' → '사용중'으로 변경", type: "improve" },
          { text: "Mock 품목 데이터를 실제 ZIP_P 제품 20개로 교체", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "정기식단 DB",
    href: "/master/menu",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "기본 탭 '고객 수령일' → '공장 생산일'로 변경", type: "improve" },
          { text: "뷰어 전용으로 변경 — 식단 배치 등록/수정/삭제 불가 (MIS 메뉴로 이관)", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "거래처",
    href: "/master/partners",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "뷰어 전용으로 변경 — 거래처 등록/수정 불가 (MIS 메뉴로 이관)", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "BOM",
    href: "/master/bom",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "Mock BOM 데이터를 실제 엑셀 기반 데이터로 교체 (잡채 10종, 닭갈비 6종)", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "BOP 유형",
    href: "/master/bop",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "메뉴 분리 — 'BOP' → 'BOP 유형' + '저장된 공정' 두 메뉴로 분리", type: "improve" },
          { text: "저장된 공정 공유 스토어 적용 (BOP 유형 ↔ 저장된 공정 페이지 실시간 연동)", type: "improve" },
          { text: "저장된 공정 예시에서 시작/끝 노드 제거 — 부분 공정 스니펫으로 변경", type: "fix" },
          { text: "팔레트에 해동 공정 그룹 추가 (해동-냉장, 해동-유수, 해동-검수)", type: "new" },
        ],
      },
      {
        date: "2026-06-05",
        items: [
          { text: "시작/끝 노드 스타일 검정으로 변경", type: "improve" },
          { text: "팔레트 탭 '낱개' → '공정' 명칭 변경", type: "fix" },
          { text: "노드 내 공정실 태그 제거, 간반 미생성 배지 추가", type: "improve" },
        ],
      },
      {
        date: "2026-06-04",
        items: [
          { text: "공정 장소별 컨테이너 그룹핑 (색상 점선 테두리, 라벨)", type: "new" },
          { text: "자동 배치 기능 추가 (PALETTE 순서 기반 가로 정렬)", type: "new" },
          { text: "확대/축소 기능 추가 (Ctrl+휠, 하단 줌 컨트롤 ±%)", type: "new" },
          { text: "뷰 모드 좌측 하단 미니맵 추가 (현재 위치 표시)", type: "new" },
          { text: "뷰 모드 좌측 BOP 목록 사이드바로 전환 (Select 제거)", type: "improve" },
          { text: "생성 모드 헤더 개선: 뒤로가기 + BOP 이름 타이틀 표시", type: "improve" },
          { text: "저장 완료 시 우측 상단 토스트 알림 노출", type: "new" },
          { text: "공정 팔레트 탭화 — 공정 / 저장된 공정 분리", type: "improve" },
          { text: "저장된 공정 기능 추가 (현재 공정 저장 → 드래그 재사용)", type: "new" },
          { text: "연결 포트 UX 개선: hover 시 원형 표시, FigJam식 연결", type: "improve" },
          { text: "연결 확인 BFS 기반 오류 감지 + 문제 구간 빨간 하이라이팅", type: "improve" },
          { text: "컨테이너 박스 겹침 방지: 초기 노드 위치 자동 정렬", type: "fix" },
        ],
      },
    ],
  },
  {
    page: "저장된 공정",
    href: "/master/bop/saved",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "신규 페이지 — 저장된 공정 목록 및 영향 범위(사용 BOP) 확인", type: "new" },
          { text: "행 클릭 시 아코디언으로 공정 노드 구성 미리보기 (공간별 그룹·화살표 흐름)", type: "new" },
          { text: "공정명 변경 기능 (사용 중 BOP 경고 포함)", type: "new" },
          { text: "삭제 기능 (사용 중 BOP 영향 범위 경고 포함)", type: "new" },
        ],
      },
    ],
  },
  {
    page: "수율",
    href: "/master/yield",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "공정 유형 '냉각' → '조리'로 변경 (뱃지 색상 파란색 → 빨간색)", type: "fix" },
          { text: "Mock 수율 데이터를 실제 엑셀 기반 SAN 25개 항목으로 교체", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "유형관리",
    href: "/master/types",
    section: "기초정보",
    entries: [
      {
        date: "2026-06-05",
        items: [
          { text: "온도 탭 제거", type: "remove" },
        ],
      },
      {
        date: "2026-06-04",
        items: [
          { text: "디바이스 설정 탭 추가 (디바이스 등록, 공정 연결)", type: "new" },
          { text: "간반 생성 규칙 안내 표시 (디바이스-공정 공간 일치 조건)", type: "new" },
          { text: "연결 공정 배지: 공간 일치 시 '·간반' 표기, 불일치 시 주황색", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "설비현황",
    href: "/equipment/status",
    section: "설비관리",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "수분발생량(kg/h) 항목 완전 제거", type: "remove" },
          { text: "설비 등록/편집 팝업 내 kcal/h 단위 레이블 넘침 현상 수정", type: "fix" },
        ],
      },
      {
        date: "2026-06-05",
        items: [
          { text: "열발생량 단위 선택 추가 — kcal/h ↔ W 토글 (등록/편집 모두)", type: "new" },
          { text: "수분발생량 단위 표기 개선 — kg/h 고정 단위 우측 표시", type: "improve" },
          { text: "테이블 헤더 '열발생량/h', '수분발생량/h'로 명칭 정비", type: "fix" },
        ],
      },
    ],
  },
  {
    page: "품목 DB",
    href: "/mis/products",
    section: "MIS(삭제 예정)",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "MIS 메뉴 신설 — 기초정보 품목 DB의 CRUD 기능 이관", type: "new" },
          { text: "기초정보 뷰어와 동일 데이터 공유 (module-level store)", type: "new" },
        ],
      },
    ],
  },
  {
    page: "정기식단 DB",
    href: "/mis/menu",
    section: "MIS(삭제 예정)",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "MIS 메뉴 신설 — 기초정보 정기식단 DB의 CRUD 기능 이관", type: "new" },
          { text: "기초정보 뷰어와 동일 데이터 공유 (localStorage)", type: "new" },
          { text: "기본 탭 '고객 수령일' → '공장 생산일'로 변경", type: "improve" },
          { text: "신규 등록 시 시작일·종료일 기본값 → 오늘(공장 생산일)", type: "improve" },
        ],
      },
    ],
  },
  {
    page: "거래처 관리",
    href: "/mis/partners",
    section: "MIS(삭제 예정)",
    entries: [
      {
        date: "2026-06-08",
        items: [
          { text: "MIS 메뉴 신설 — 기초정보 거래처의 CRUD 기능 이관", type: "new" },
          { text: "기초정보 뷰어와 동일 데이터 공유 (suppliers API 모듈)", type: "new" },
          { text: "Z-MIS 연동 버튼 제거", type: "remove" },
        ],
      },
    ],
  },
]

export type ChangeType = ChangeItem["type"]

export const CHANGE_TYPE_LABEL: Record<NonNullable<ChangeType>, { label: string; color: string }> = {
  new:     { label: "신규",   color: "bg-blue-100 text-blue-700" },
  improve: { label: "개선",   color: "bg-green-100 text-green-700" },
  fix:     { label: "수정",   color: "bg-amber-100 text-amber-700" },
  remove:  { label: "제거",   color: "bg-red-100 text-red-600" },
}
