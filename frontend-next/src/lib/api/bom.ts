import { mockDevBomRows, mockNormalBomRows, groupByParent, buildBomTree, getItemUnit } from "@/mocks/bom"
import { mockItemDetails } from "@/lib/mock-items"
import type {
  BomParentRow, BomFilterParams, BomTreeNode, BomMaterialInput,
  DevBomRawRow, NormalBomRawRow, UnifiedBomParentRow, BomType, PaginatedResponse,
} from "@/types/bom"

interface BomQueryParams extends BomFilterParams {
  page: number
  pageSize: number
  sortKey?: string
  sortDirection?: "asc" | "desc"
}

// 통합 모품목 목록
export async function getUnifiedBomParents(
  params: BomQueryParams
): Promise<PaginatedResponse<UnifiedBomParentRow>> {
  const devParents = groupByParent(mockDevBomRows)
  const normalParents = groupByParent(mockNormalBomRows)

  const map = new Map<string, UnifiedBomParentRow>()

  for (const row of devParents) {
    map.set(row.productCode, {
      productCode: row.productCode,
      productName: row.productName,
      codePrefix: row.codePrefix,
      itemType: row.itemType,
      devChildCount: row.childCount,
      normalChildCount: 0,
      bulkChildCount: 0,
      bulkThreshold: null,
      bomTypes: ["DEV"],
    })
  }

  for (const row of normalParents) {
    const existing = map.get(row.productCode)
    if (existing) {
      existing.normalChildCount = row.childCount
      existing.bomTypes.push("NORMAL")
    } else {
      map.set(row.productCode, {
        productCode: row.productCode,
        productName: row.productName,
        codePrefix: row.codePrefix,
        itemType: row.itemType,
        devChildCount: 0,
        normalChildCount: row.childCount,
        bulkChildCount: 0,
        bulkThreshold: null,
        bomTypes: ["NORMAL"],
      })
    }
  }

  let filtered = Array.from(map.values())

  if (params.search) {
    const q = params.search.toLowerCase()
    filtered = filtered.filter(
      (r) => r.productCode.toLowerCase().includes(q) || r.productName.toLowerCase().includes(q)
    )
  }

  if (params.itemType) {
    filtered = filtered.filter((r) => r.itemType === params.itemType)
  }

  if (params.bomTypes && params.bomTypes.length > 0) {
    filtered = filtered.filter((r) =>
      params.bomTypes!.every((t) => r.bomTypes.includes(t))
    )
  }

  if (params.sortKey && params.sortDirection) {
    const key = params.sortKey as keyof UnifiedBomParentRow
    const dir = params.sortDirection === "asc" ? 1 : -1
    filtered.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir
      return String(av).localeCompare(String(bv), "ko") * dir
    })
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const data = filtered.slice(start, start + params.pageSize)

  return { data, total, page: params.page, pageSize: params.pageSize }
}

// 개발 BOM 트리
export async function getDevBomTree(productCode: string): Promise<BomTreeNode[]> {
  return buildBomTree<DevBomRawRow>(
    productCode, mockDevBomRows,
    (row) => row.requiredQty, () => "g",
    new Set(), 0, 5, false
  )
}

// 일반 BOM 트리
export async function getNormalBomTree(productCode: string): Promise<BomTreeNode[]> {
  return buildBomTree<NormalBomRawRow>(
    productCode, mockNormalBomRows,
    (row) => row.yieldAdjustedQty,
    (row) => getItemUnit(row.materialCode),
    new Set(), 0, 5, true
  )
}

// 대용량 BOM 트리 (데이터 없음)
export async function getBulkBomTree(_productCode: string): Promise<BomTreeNode[]> {
  return []
}

// BomTreeNode[] → 편집 가능한 BomMaterialInput[]
export function bomTreeToMaterialInputs(tree: BomTreeNode[]): BomMaterialInput[] {
  return tree.map((node) => ({
    materialCode: node.code,
    materialName: node.name,
    qty: node.qty,
    unit: node.unit,
    weightPerUnit: "",
  }))
}

// 3종 BOM 비교 조회
export interface BomComparisonResult {
  dev: BomTreeNode[]
  normal: BomTreeNode[]
  bulk: BomTreeNode[]
  devProductionQty: number
  normalProductionQty: number
  bulkProductionQty: number
  productUnit: string
  productWeightPerUnit: string
}

export async function getBomComparison(productCode: string): Promise<BomComparisonResult> {
  const [dev, normal, bulk] = await Promise.all([
    getDevBomTree(productCode),
    getNormalBomTree(productCode),
    getBulkBomTree(productCode),
  ])
  const devRow = mockDevBomRows.find((r) => r.productCode === productCode)
  const normalRow = mockNormalBomRows.find((r) => r.productCode === productCode)
  const product = mockItemDetails.find((i) => i.code === productCode)
  return {
    dev,
    normal,
    bulk,
    devProductionQty: devRow?.productionQty ?? 0,
    normalProductionQty: normalRow?.productionQty ?? 0,
    bulkProductionQty: 0,
    productUnit: product?.unit ?? "",
    productWeightPerUnit: product?.weightPerUnit ?? "",
  }
}
