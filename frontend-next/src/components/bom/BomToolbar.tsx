"use client"

import { Search, RotateCcw, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ITEM_TYPE_LABELS } from "@/types/products"
import { BOM_TYPE_LABELS, type BomFilterParams, type BomType } from "@/types/bom"
import { cn } from "@/lib/utils"

interface BomToolbarProps {
  filters: BomFilterParams
  onFilterChange: (filters: BomFilterParams) => void
  onCreateClick: () => void
}

const BOM_TYPES: BomType[] = ["DEV", "NORMAL", "BULK"]
const ALL_ITEM_TYPE_LABEL = "전체 품목구분"

export function BomToolbar({ filters, onFilterChange, onCreateClick }: BomToolbarProps) {
  const updateFilter = (key: keyof BomFilterParams, value: string | undefined) => {
    onFilterChange({ ...filters, [key]: value || undefined })
  }

  const toggleBomType = (bomType: BomType) => {
    const current = filters.bomTypes ?? []
    const next = current.includes(bomType)
      ? current.filter((t) => t !== bomType)
      : [...current, bomType]
    onFilterChange({ ...filters, bomTypes: next.length > 0 ? next : undefined })
  }

  const resetFilters = () => {
    onFilterChange({})
  }

  const selectedBomTypes = filters.bomTypes ?? []
  // Select에서 표시할 한글 라벨
  const selectedItemTypeLabel = filters.itemType
    ? (ITEM_TYPE_LABELS[filters.itemType as keyof typeof ITEM_TYPE_LABELS] ?? filters.itemType)
    : ALL_ITEM_TYPE_LABEL

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="코드 / 품목명 검색"
          value={filters.search ?? ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-52 pl-8"
        />
      </div>

      <Select
        value={selectedItemTypeLabel}
        onValueChange={(val) => {
          if (val === ALL_ITEM_TYPE_LABEL) {
            updateFilter("itemType", undefined)
          } else {
            const entry = Object.entries(ITEM_TYPE_LABELS).find(([, l]) => l === val)
            if (entry) updateFilter("itemType", entry[0])
          }
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_ITEM_TYPE_LABEL}>전체</SelectItem>
          {Object.values(ITEM_TYPE_LABELS).map((label) => (
            <SelectItem key={label} value={label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        {BOM_TYPES.map((t) => {
          const isActive = selectedBomTypes.includes(t)
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleBomType(t)}
              className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors",
                "border cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-input hover:bg-muted"
              )}
            >
              {BOM_TYPE_LABELS[t]}
            </button>
          )
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-1" onClick={resetFilters}>
          <RotateCcw className="size-3.5" />
          초기화
        </Button>
        <Button size="sm" className="gap-1" onClick={onCreateClick}>
          <Plus className="size-3.5" />
          신규 등록
        </Button>
      </div>
    </div>
  )
}
