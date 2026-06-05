"use client"

import { useState, useMemo } from "react"
import { ChevronRight, Package, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useBomCompare } from "@/hooks/useBom"
import { BOM_TYPE_LABELS, type BomType, type BomTreeNode } from "@/types/bom"
import { ITEM_TYPE_LABELS, type ItemType } from "@/types/products"
import { cn } from "@/lib/utils"

interface BomDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productCode: string | null
  productName: string | null
}

function parseWeightPerUnit(wpu: string): number {
  if (!wpu) return 0
  const match = wpu.match(/^([\d.]+)\s*(g|kg|ml|l)$/i)
  if (!match) return 0
  const val = parseFloat(match[1])
  const u = match[2].toLowerCase()
  if (u === "kg" || u === "l") return val * 1000
  return val
}

function toGrams(qty: number, unit: string): number {
  const u = unit.toLowerCase()
  if (u === "kg" || u === "l") return qty * 1000
  return qty
}

function buildPerKgMap(
  tree: BomTreeNode[],
  productionQty: number,
  wpuGrams: number
): Map<string, number> {
  const map = new Map<string, number>()
  if (productionQty <= 0 || wpuGrams <= 0) return map
  const totalWeightG = productionQty * wpuGrams
  for (const node of tree) {
    const materialG = toGrams(node.qty, node.unit)
    const perKg = (materialG / totalWeightG) * 1000
    map.set(node.code, perKg)
  }
  return map
}

function formatPerKg(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000
    const rounded = Math.round(kg * 100) / 100
    return `${rounded}kg/kg`
  }
  return `${Math.round(grams)}g/kg`
}

function formatDiff(diff: number): { text: string; color: string } {
  const absDiff = Math.abs(diff)
  let text: string
  if (absDiff >= 1000) {
    const kg = absDiff / 1000
    text = `${Math.round(kg * 100) / 100}kg`
  } else {
    text = `${Math.round(absDiff)}g`
  }

  if (diff > 0.5) return { text: `+${text}`, color: "text-red-500" }
  if (diff < -0.5) return { text: `-${text}`, color: "text-blue-500" }
  return { text: "0", color: "text-muted-foreground" }
}

function roundTo(n: number, decimals: number): string {
  const factor = Math.pow(10, decimals)
  const rounded = Math.round(n * factor) / factor
  return rounded.toFixed(decimals).replace(/\.?0+$/, "")
}

function formatBomQty(qty: number, unit: string): { text: string; isBig: boolean } {
  const u = unit.toLowerCase()
  if (u === "g" && qty >= 1000) return { text: `${roundTo(qty / 1000, 2)} kg`, isBig: true }
  if (u === "ml" && qty >= 1000) return { text: `${roundTo(qty / 1000, 2)} L`, isBig: true }
  if (u === "kg" && qty < 1) return { text: `${Math.round(qty * 1000)}g`, isBig: false }
  if (u === "l" && qty < 1) return { text: `${Math.round(qty * 1000)}mL`, isBig: false }
  if (u === "kg") return { text: `${roundTo(qty, 2)} kg`, isBig: true }
  if (u === "l") return { text: `${roundTo(qty, 2)} L`, isBig: true }
  if (u === "g") return { text: `${Math.round(qty)}g`, isBig: false }
  if (u === "ml") return { text: `${Math.round(qty)}mL`, isBig: false }
  return { text: `${Math.round(qty)}${unit}`, isBig: false }
}

function typeLabel(itemType: string, code: string): string {
  if (itemType && ITEM_TYPE_LABELS[itemType as ItemType]) {
    return ITEM_TYPE_LABELS[itemType as ItemType]
  }
  const match = code.match(/^([A-Z]+_[A-Z])/)
  if (match) {
    const FB: Record<string, string> = {
      ZIP_M: "원재료", ZIP_S: "부자재", ZIP_H: "반제품",
      ZIP_P: "완제품", RES_P: "반제품", BAN_P: "완제품",
    }
    return FB[match[1]] ?? match[1]
  }
  const numIdx = code.search(/\d/)
  const prefix = numIdx > 0 ? code.substring(0, numIdx).replace(/_$/, "") : code
  if (prefix === "SAN") return "반제품"
  return prefix
}

function typeVariant(itemType: string): "default" | "secondary" | "outline" {
  if (itemType === "RAW_MATERIAL" || itemType === "SUB_MATERIAL") return "outline"
  if (itemType === "SEMI_FINISHED") return "secondary"
  return "default"
}

function TreeNode({
  node,
  bomType,
  perKgMap,
  devPerKgMap,
}: {
  node: BomTreeNode
  bomType: BomType
  perKgMap: Map<string, number>
  devPerKgMap: Map<string, number>
}) {
  const [isOpen, setIsOpen] = useState(false)
  const label = typeLabel(node.itemType, node.code)
  const { text: qtyText, isBig } = formatBomQty(node.qty, node.unit)
  const perKg = perKgMap.get(node.code)
  const devPerKg = devPerKgMap.get(node.code)

  const showDiff = bomType !== "DEV" && perKg !== undefined
  let diffEl: React.ReactNode = null
  if (showDiff && perKg !== undefined) {
    if (devPerKg !== undefined) {
      const diff = perKg - devPerKg
      const { text: diffText, color } = formatDiff(diff)
      diffEl = <span className={cn("text-[9px] shrink-0", color)}>{diffText}</span>
    } else {
      diffEl = <span className="text-[9px] text-amber-600 shrink-0">+{formatPerKg(perKg)} (신규)</span>
    }
  }

  const rowClass = "flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted/50"

  const qtyClass = cn(
    "text-[10px] shrink-0",
    isBig ? "font-semibold text-foreground" : "text-muted-foreground"
  )

  const perKgEl = perKg !== undefined
    ? <span className="text-[9px] text-muted-foreground shrink-0">({formatPerKg(perKg)})</span>
    : null

  if (!node.hasChildren) {
    return (
      <div className={rowClass} style={{ paddingLeft: `${node.level * 20 + 8}px` }}>
        <Package className="size-3 text-muted-foreground shrink-0" />
        <Badge variant={typeVariant(node.itemType)} className="text-[10px] shrink-0">
          {label}
        </Badge>
        <span className="text-xs truncate">{node.name}</span>
        <span className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className={qtyClass}>{qtyText}</span>
          {perKgEl}
          {diffEl}
        </span>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        className={cn(rowClass, "w-full cursor-pointer")}
        style={{ paddingLeft: `${node.level * 20 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronRight
          className={cn(
            "size-3 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-90"
          )}
        />
        <Badge variant={typeVariant(node.itemType)} className="text-[10px] shrink-0">
          {label}
        </Badge>
        <Layers className="size-3 text-muted-foreground shrink-0" />
        <span className="text-xs font-medium truncate">{node.name}</span>
        <span className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className={qtyClass}>{qtyText}</span>
          {perKgEl}
          {diffEl}
        </span>
      </button>
      {isOpen && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode
              key={`${child.code}-${i}`}
              node={child}
              bomType={bomType}
              perKgMap={perKgMap}
              devPerKgMap={devPerKgMap}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function BomTreePanel({
  bomType,
  tree,
  loading,
  perKgMap,
  devPerKgMap,
  productionQty,
  productUnit,
  productWeightPerUnit,
}: {
  bomType: BomType
  tree: BomTreeNode[]
  loading: boolean
  perKgMap: Map<string, number>
  devPerKgMap: Map<string, number>
  productionQty: number
  productUnit: string
  productWeightPerUnit: string
}) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="pb-2 border-b mb-2 space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {BOM_TYPE_LABELS[bomType]}
          </Badge>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {tree.length}건
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {bomType === "DEV" && (
            <Badge variant="outline" className="text-[9px]">기준</Badge>
          )}
          {productionQty > 0 && (
            <span>생산량: {productionQty}{productUnit} ({productWeightPerUnit})</span>
          )}
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        {loading ? (
          <div className="space-y-2 p-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : tree.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-xs">데이터 없음</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {tree.map((node, i) => (
              <TreeNode
                key={`${node.code}-${i}`}
                node={node}
                bomType={bomType}
                perKgMap={perKgMap}
                devPerKgMap={devPerKgMap}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export function BomDetailDialog({
  open,
  onOpenChange,
  productCode,
  productName,
}: BomDetailDialogProps) {
  const { data, loading } = useBomCompare(open ? productCode : null)

  const wpuGrams = useMemo(
    () => parseWeightPerUnit(data.productWeightPerUnit),
    [data.productWeightPerUnit]
  )

  const devPerKgMap = useMemo(
    () => buildPerKgMap(data.dev, data.devProductionQty, wpuGrams),
    [data.dev, data.devProductionQty, wpuGrams]
  )
  const normalPerKgMap = useMemo(
    () => buildPerKgMap(data.normal, data.normalProductionQty, wpuGrams),
    [data.normal, data.normalProductionQty, wpuGrams]
  )
  const bulkPerKgMap = useMemo(
    () => buildPerKgMap(data.bulk, data.bulkProductionQty, wpuGrams),
    [data.bulk, data.bulkProductionQty, wpuGrams]
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{productName ?? "BOM 상세"}</DialogTitle>
          <DialogDescription>
            {productCode} — 3종 BOM 비교
            {data.productUnit && (
              <span className="ml-2">
                | 단위: <strong>{data.productUnit}</strong>
                {data.productWeightPerUnit && (
                  <> | 단위당중량: <strong>{data.productWeightPerUnit}</strong></>
                )}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          <BomTreePanel
            bomType="DEV"
            tree={data.dev}
            loading={loading}
            perKgMap={devPerKgMap}
            devPerKgMap={devPerKgMap}
            productionQty={data.devProductionQty}
            productUnit={data.productUnit}
            productWeightPerUnit={data.productWeightPerUnit}
          />
          <BomTreePanel
            bomType="NORMAL"
            tree={data.normal}
            loading={loading}
            perKgMap={normalPerKgMap}
            devPerKgMap={devPerKgMap}
            productionQty={data.normalProductionQty}
            productUnit={data.productUnit}
            productWeightPerUnit={data.productWeightPerUnit}
          />
          <BomTreePanel
            bomType="BULK"
            tree={data.bulk}
            loading={loading}
            perKgMap={bulkPerKgMap}
            devPerKgMap={devPerKgMap}
            productionQty={data.bulkProductionQty}
            productUnit={data.productUnit}
            productWeightPerUnit={data.productWeightPerUnit}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
