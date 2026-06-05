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
    page: "BOP",
    href: "/master/bop",
    section: "기초정보",
    entries: [
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
        date: "2026-06-05",
        items: [
          { text: "열발생량 단위 선택 추가 — kcal/h ↔ W 토글 (등록/편집 모두)", type: "new" },
          { text: "수분발생량 단위 표기 개선 — kg/h 고정 단위 우측 표시", type: "improve" },
          { text: "테이블 헤더 '열발생량/h', '수분발생량/h'로 명칭 정비", type: "fix" },
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
