"use client"

import { useState } from "react"
import { Search, Plus, RotateCcw, RefreshCw, CheckCircle2, Loader2, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterMultiSelect } from "@/components/common/FilterMultiSelect"
import {
  ITEM_TYPE_LABELS, ITEM_TYPE_ORDER,
  STORAGE_METHOD_LABELS, STORAGE_METHOD_ORDER,
  SALES_CHANNEL_LABELS, SALES_CHANNEL_ORDER,
  CODE_PREFIX_LABELS, CODE_PREFIX_ORDER,
  ACTIVE_STATUS_LABELS,
  type ItemFilterParams, type ItemType, type StorageMethod,
  type YesNo, type SalesChannelFilter, type CodePrefixFilter, type ActiveStatusFilter,
} from "@/types/products"

type SyncState = "idle" | "syncing" | "done"

interface ProductsToolbarProps {
  filters: ItemFilterParams
  onFilterChange: (filters: ItemFilterParams) => void
  onCreateClick?: () => void
  showSync?: boolean
}

const typeOptions = ITEM_TYPE_ORDER.map((v) => ({ value: v, label: ITEM_TYPE_LABELS[v] }))
const storageOptions = STORAGE_METHOD_ORDER.map((v) => ({ value: v, label: STORAGE_METHOD_LABELS[v] }))
const stockControlOptions = [{ value: "Y", label: "Y" }, { value: "N", label: "N" }]
const salesChannelOptions = SALES_CHANNEL_ORDER.map((v) => ({ value: v, label: SALES_CHANNEL_LABELS[v] }))
const codePrefixOptions = CODE_PREFIX_ORDER.map((v) => ({ value: v, label: CODE_PREFIX_LABELS[v] }))

export function ProductsToolbar({ filters, onFilterChange, onCreateClick, showSync }: ProductsToolbarProps) {
  const [syncState, setSyncState] = useState<SyncState>("idle")
  const [syncDialogOpen, setSyncDialogOpen] = useState(false)

  const handleSync = () => {
    setSyncDialogOpen(true)
    setSyncState("syncing")
    setTimeout(() => setSyncState("done"), 2000)
  }

  return (
    <div className="space-y-2">
      {/* 필터 + 액션 */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* 필터 영역 */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="코드 / 품목명 검색"
              value={filters.search ?? ""}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value || undefined })}
              className="w-44 pl-8 h-8 text-sm"
            />
          </div>

          <Select
            value={filters.activeStatus ?? "ALL"}
            onValueChange={(v) => onFilterChange({ ...filters, activeStatus: v as ActiveStatusFilter })}
          >
            <SelectTrigger className="h-8 w-28 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ACTIVE_STATUS_LABELS) as [ActiveStatusFilter, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-sm">{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FilterMultiSelect
            label="품목코드"
            options={codePrefixOptions}
            selected={filters.codePrefix ?? []}
            onChange={(vals) => onFilterChange({ ...filters, codePrefix: vals.length > 0 ? vals as CodePrefixFilter[] : undefined })}
            className="w-28"
          />

          <FilterMultiSelect
            label="품목구분"
            options={typeOptions}
            selected={filters.type ?? []}
            onChange={(vals) => onFilterChange({ ...filters, type: vals.length > 0 ? vals as ItemType[] : undefined })}
            className="w-28"
          />

          <FilterMultiSelect
            label="보관방법"
            options={storageOptions}
            selected={filters.storageMethod ?? []}
            onChange={(vals) => onFilterChange({ ...filters, storageMethod: vals.length > 0 ? vals as StorageMethod[] : undefined })}
            className="w-28"
          />

          <FilterMultiSelect
            label="재고관리"
            options={stockControlOptions}
            selected={filters.stockControl ?? []}
            onChange={(vals) => onFilterChange({ ...filters, stockControl: vals.length > 0 ? vals as YesNo[] : undefined })}
            className="w-24"
          />

          <FilterMultiSelect
            label="판매채널"
            options={salesChannelOptions}
            selected={filters.salesChannel ?? []}
            onChange={(vals) => onFilterChange({ ...filters, salesChannel: vals.length > 0 ? vals as SalesChannelFilter[] : undefined })}
            className="w-28"
          />

          <Button variant="ghost" size="sm" className="gap-1" onClick={() => onFilterChange({})}>
            <RotateCcw className="size-3.5" />
            초기화
          </Button>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 shrink-0">
          {showSync && (
            <Button variant="outline" size="sm" className="gap-1" onClick={handleSync} disabled={syncState === "syncing"}>
              <RefreshCw className={`size-3.5 ${syncState === "syncing" ? "animate-spin" : ""}`} />
              Z-MIS 연동
            </Button>
          )}
          {onCreateClick && (
            <Button size="sm" className="gap-1" onClick={onCreateClick}>
              <Plus className="size-3.5" />
              신규 등록
            </Button>
          )}
        </div>
      </div>

      {/* Z-MIS 연동 팝업 */}
      <Dialog open={syncDialogOpen} onOpenChange={(open) => { setSyncDialogOpen(open); if (!open) setSyncState("idle") }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle>Z-MIS 연동</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-6">
            {syncState === "syncing" && (
              <>
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-medium">연동 중...</p>
              </>
            )}
            {syncState === "done" && (
              <>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <p className="text-sm font-medium text-green-600">연동 완료</p>
                <div className="flex items-start gap-2 rounded-md border bg-muted/50 p-3 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>본 개발 시 API 연동 예정입니다. 현재는 Mock 데이터를 사용합니다.</span>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
