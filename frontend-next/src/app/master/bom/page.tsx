"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { BomToolbar } from "@/components/bom/BomToolbar"
import { BomDetailDialog } from "@/components/bom/BomDetailDialog"
import { useUnifiedBomList } from "@/hooks/useBom"
import { BOM_TYPE_LABELS, type BomType, type UnifiedBomParentRow } from "@/types/bom"
import { ITEM_TYPE_LABELS, type ItemType } from "@/types/products"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown } from "lucide-react"

function itemTypeBadge(row: UnifiedBomParentRow) {
  const type = row.itemType
  let label = ITEM_TYPE_LABELS[type as ItemType]
  if (!label) {
    const PREFIX_FALLBACK: Record<string, string> = {
      ZIP_M: "원재료", ZIP_S: "부자재", ZIP_H: "반제품",
      ZIP_P: "완제품", RES_P: "반제품", BAN_P: "완제품",
      SAN: "반제품", ZIP_C: "콤보",
    }
    label = PREFIX_FALLBACK[row.codePrefix] ?? row.codePrefix
  }
  const variant = type === "RAW_MATERIAL" || type === "SUB_MATERIAL" ? "outline" as const
    : type === "SEMI_FINISHED" || !ITEM_TYPE_LABELS[type as ItemType] ? "secondary" as const
    : "default" as const
  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  )
}

const BOM_BADGE_VARIANT: Record<BomType, "default" | "secondary" | "outline"> = {
  DEV: "default",
  NORMAL: "secondary",
  BULK: "outline",
}

function SortIcon({ column, sortKey, sortDirection }: { column: string; sortKey: string; sortDirection: "asc" | "desc" }) {
  if (sortKey !== column) return <span className="inline-block w-3" />
  return sortDirection === "asc"
    ? <ChevronUp className="inline-block size-3" />
    : <ChevronDown className="inline-block size-3" />
}

export default function BomPage() {
  const router = useRouter()
  const {
    items, total, loading,
    filters, setFilters,
    page, setPage,
    pageSize,
    sort, setSort,
  } = useUnifiedBomList()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [selectedName, setSelectedName] = useState<string | null>(null)

  const handleRowClick = useCallback((row: UnifiedBomParentRow) => {
    setSelectedCode(row.productCode)
    setSelectedName(row.productName)
    setDialogOpen(true)
  }, [])

  const handleCreateClick = useCallback(() => {
    router.push("/master/bom/register")
  }, [router])

  const handleSortChange = (key: string) => {
    if (sort.key === key) {
      setSort(key, sort.direction === "asc" ? "desc" : "asc")
    } else {
      setSort(key, "asc")
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">기초정보</p>
          <h1 className="text-2xl font-bold tracking-tight">BOM</h1>
        </div>
      </div>

      <div className="space-y-4 px-4 lg:px-6">
        <BomToolbar
          filters={filters}
          onFilterChange={setFilters}
          onCreateClick={handleCreateClick}
        />

        {/* 테이블 */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  className="w-32 cursor-pointer select-none"
                  onClick={() => handleSortChange("productCode")}
                >
                  생산품목코드 <SortIcon column="productCode" sortKey={sort.key} sortDirection={sort.direction} />
                </TableHead>
                <TableHead
                  className="min-w-40 cursor-pointer select-none"
                  onClick={() => handleSortChange("productName")}
                >
                  생산품목명 <SortIcon column="productName" sortKey={sort.key} sortDirection={sort.direction} />
                </TableHead>
                <TableHead className="w-24">품목구분</TableHead>
                <TableHead className="w-36">BOM 유형</TableHead>
                <TableHead className="w-16 text-center">개발</TableHead>
                <TableHead className="w-16 text-center">일반</TableHead>
                <TableHead className="w-16 text-center">대용량</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    조건에 맞는 BOM이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((row) => (
                  <TableRow
                    key={row.productCode}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    <TableCell className="font-mono text-xs">{row.productCode}</TableCell>
                    <TableCell className="font-medium">{row.productName}</TableCell>
                    <TableCell>{itemTypeBadge(row)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {row.bomTypes.map((t) => (
                          <Badge key={t} variant={BOM_BADGE_VARIANT[t]} className="text-[10px]">
                            {BOM_TYPE_LABELS[t]}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {row.devChildCount > 0 ? <Badge variant="secondary" className="text-xs">{row.devChildCount}</Badge> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.normalChildCount > 0 ? <Badge variant="secondary" className="text-xs">{row.normalChildCount}</Badge> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.bulkChildCount > 0 ? <Badge variant="secondary" className="text-xs">{row.bulkChildCount}</Badge> : <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              총 {total}건 · {page}/{totalPages} 페이지
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                이전
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                const p = start + i
                if (p > totalPages) return null
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className={cn("min-w-8", p === page && "pointer-events-none")}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>

      <BomDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productCode={selectedCode}
        productName={selectedName}
      />
    </div>
  )
}
