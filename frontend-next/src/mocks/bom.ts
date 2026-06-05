import devRawData from "./dev-bom-data.json"
import normalRawData from "./normal-bom-data.json"
import itemLookup from "./item-lookup.json"
import type { DevBomRawRow, NormalBomRawRow, BomParentRow, BomTreeNode } from "@/types/bom"

export const mockDevBomRows: DevBomRawRow[] = devRawData as DevBomRawRow[]
export const mockNormalBomRows: NormalBomRawRow[] = normalRawData as NormalBomRawRow[]

// 경량 품목DB 룩업 (code → { t: type, u: unit })
const lookupMap = itemLookup as Record<string, { t: string; u: string }>

export function getItemType(code: string): string {
  return lookupMap[code]?.t ?? ""
}

export function getItemUnit(code: string): string {
  return lookupMap[code]?.u ?? ""
}

// 코드 접두사 추출 (ZIP_H_0001 → ZIP_H, SAN_0001 → SAN)
export function extractCodePrefix(code: string): string {
  const match = code.match(/^([A-Z]+_[A-Z])/)
  if (match) return match[1]
  const numIdx = code.search(/\d/)
  return numIdx > 0 ? code.substring(0, numIdx).replace(/_$/, "") : code
}

// 모품목 기준 그룹화
export function groupByParent<T extends { productCode: string; productName: string }>(
  rows: T[]
): BomParentRow[] {
  const map = new Map<string, { name: string; count: number }>()

  for (const row of rows) {
    const existing = map.get(row.productCode)
    if (existing) {
      existing.count++
    } else {
      map.set(row.productCode, { name: row.productName, count: 1 })
    }
  }

  return Array.from(map.entries()).map(([code, { name, count }]) => ({
    productCode: code,
    productName: name,
    childCount: count,
    codePrefix: extractCodePrefix(code),
    itemType: getItemType(code),
  }))
}

// 개발 BOM의 productCode Set
const devProductCodeSet = new Set(mockDevBomRows.map((r) => r.productCode))

// 이름 → 개발 BOM productCode 매핑
const devNameToCodeMap = new Map<string, string>()
for (const row of mockDevBomRows) {
  if (!devNameToCodeMap.has(row.productName)) {
    devNameToCodeMap.set(row.productName, row.productCode)
  }
}

function findDevProductCode(code: string, name: string): string | null {
  if (devProductCodeSet.has(code)) return code
  return devNameToCodeMap.get(name) ?? null
}

// 다단계 BOM 트리 빌드
export function buildBomTree<T extends { productCode: string; materialCode: string; materialName: string }>(
  parentCode: string,
  rawRows: T[],
  getQty: (row: T) => number,
  getUnit: (row: T) => string,
  visited: Set<string> = new Set(),
  depth: number = 0,
  maxDepth: number = 5,
  useCrossBomFallback: boolean = false
): BomTreeNode[] {
  if (depth >= maxDepth || visited.has(parentCode)) return []

  const nextVisited = new Set(visited)
  nextVisited.add(parentCode)

  const allProductCodes = new Set(rawRows.map((r) => r.productCode))
  const children = rawRows.filter((r) => r.productCode === parentCode)

  return children.map((child) => {
    const hasInPrimary = allProductCodes.has(child.materialCode)
    const devCode = useCrossBomFallback
      ? findDevProductCode(child.materialCode, child.materialName)
      : null
    const hasChildren = hasInPrimary || devCode !== null

    let subChildren: BomTreeNode[] = []
    if (hasInPrimary) {
      subChildren = buildBomTree(child.materialCode, rawRows, getQty, getUnit, nextVisited, depth + 1, maxDepth, useCrossBomFallback)
    } else if (devCode) {
      subChildren = buildBomTree<DevBomRawRow>(
        devCode,
        mockDevBomRows,
        (row) => row.requiredQty,
        () => "g",
        nextVisited,
        depth + 1,
        maxDepth,
        false
      )
    }

    const materialUnit = getItemUnit(child.materialCode)

    return {
      code: child.materialCode,
      name: child.materialName,
      qty: getQty(child),
      unit: getUnit(child) || materialUnit,
      itemType: getItemType(child.materialCode),
      level: depth,
      hasChildren,
      children: subChildren,
    }
  })
}
