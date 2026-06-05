// BOM 유형
export type BomType = "DEV" | "NORMAL" | "BULK"

// BOM 유형 라벨
export const BOM_TYPE_LABELS: Record<BomType, string> = {
  DEV: "개발 BOM",
  NORMAL: "일반 BOM",
  BULK: "대용량 BOM",
}

// 품목코드 접두사 라벨
export const CODE_PREFIX_LABELS: Record<string, string> = {
  ZIP_P: "집밥",
  ZIP_H: "소스",
  ZIP_M: "원재료",
  ZIP_S: "부자재",
  ZIP_C: "콤보",
  RES_P: "반제품",
  SAN: "산너머",
  BAN_P: "반가",
}

// 개발 BOM 원본 행
export interface DevBomRawRow {
  productCode: string
  productName: string
  materialCode: string
  materialName: string
  productionQty: number
  requiredQty: number
  weight: number | null
}

// 일반 BOM 원본 행
export interface NormalBomRawRow {
  productCode: string
  productName: string
  materialCode: string
  materialName: string
  productionQty: number
  yieldAdjustedQty: number
}

// 목록 테이블용 모품목 행
export interface BomParentRow {
  productCode: string
  productName: string
  childCount: number
  codePrefix: string
  itemType: string
}

// 트리 노드 (재귀)
export interface BomTreeNode {
  code: string
  name: string
  qty: number
  unit: string
  itemType: string
  level: number
  hasChildren: boolean
  children: BomTreeNode[]
}

// 통합 테이블용 모품목 행
export interface UnifiedBomParentRow {
  productCode: string
  productName: string
  codePrefix: string
  itemType: string
  devChildCount: number
  normalChildCount: number
  bulkChildCount: number
  bulkThreshold: number | null
  bomTypes: BomType[]
}

// 필터 파라미터
export interface BomFilterParams {
  search?: string
  codePrefix?: string
  itemType?: string
  bomTypes?: BomType[]
}

// BOM 등록 자품목 행
export interface BomMaterialInput {
  materialCode: string
  materialName: string
  qty: number
  unit: string
  weightPerUnit: string
}

// BOM 등록 폼 데이터
export interface BomCreateInput {
  productCode: string
  productName: string
  bomType: BomType
  bulkThreshold: number | null
  productionQty: number
  materials: BomMaterialInput[]
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
