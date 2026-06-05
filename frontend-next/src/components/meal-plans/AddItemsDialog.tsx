"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getItems } from "@/lib/api/products"
import { Copy, Plus, X, Search } from "lucide-react"
import type { DailyMealPlan, MealPlanItem } from "@/types/meal-plan"
import type { ItemDetail } from "@/types/products"

interface AddItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetDate: string
  mealPlanCode: string
  mealPlanName: string
  existingPlans: DailyMealPlan[]
  onSave: (items: MealPlanItem[]) => void
  isSubmitting: boolean
}

export function AddItemsDialog({
  open,
  onOpenChange,
  targetDate,
  mealPlanCode,
  mealPlanName,
  existingPlans,
  onSave,
  isSubmitting,
}: AddItemsDialogProps) {
  const [items, setItems] = useState<MealPlanItem[]>([])
  const [copySource, setCopySource] = useState<string>("")
  const [keyword, setKeyword] = useState("")
  const [products, setProducts] = useState<ItemDetail[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const availableDates = useMemo(() => {
    return existingPlans
      .filter((p) => p.mealPlanCode === mealPlanCode && p.date !== targetDate && p.items.length > 0)
      .map((p) => p.date)
      .filter((d, i, arr) => arr.indexOf(d) === i)
      .sort()
      .reverse()
      .slice(0, 30)
  }, [existingPlans, mealPlanCode, targetDate])

  useEffect(() => {
    if (open) {
      setItems([])
      setCopySource("")
      setShowSearch(false)
      setKeyword("")
    }
  }, [open])

  useEffect(() => {
    if (!showSearch) return
    const timer = setTimeout(async () => {
      const result = await getItems({ search: keyword || undefined, pageSize: 50 })
      setProducts(result.data)
    }, 200)
    return () => clearTimeout(timer)
  }, [keyword, showSearch])

  const handleCopy = (dateStr: string) => {
    setCopySource(dateStr)
    const source = existingPlans.find((p) => p.date === dateStr && p.mealPlanCode === mealPlanCode)
    if (source) setItems([...source.items])
  }

  const addItem = (product: ItemDetail) => {
    if (items.some((i) => i.zipCode === product.code)) return
    const weight = product.weightPerUnit ?? ""
    setItems([...items, { zipCode: product.code, productName: product.name, weight, quantity: 1 }])
  }

  const removeItem = (zipCode: string) => {
    setItems(items.filter((i) => i.zipCode !== zipCode))
  }

  const updateQuantity = (zipCode: string, quantity: number) => {
    setItems(items.map((i) => i.zipCode === zipCode ? { ...i, quantity: Math.max(1, quantity) } : i))
  }

  const handleSave = () => {
    if (items.length === 0) return
    onSave(items)
  }

  const dayOfWeek = (() => {
    const d = new Date(targetDate + "T00:00:00")
    return ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
  })()

  // copySource Select의 한글 표시값
  const copySourceDisplay = copySource
    ? (() => {
        const plan = existingPlans.find((p) => p.date === copySource && p.mealPlanCode === mealPlanCode)
        const dow = ["일", "월", "화", "수", "목", "금", "토"][new Date(copySource + "T00:00:00").getDay()]
        return `${copySource} (${dow}) — ${plan?.items.length ?? 0}개 품목`
      })()
    : "복사할 날짜 선택..."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>구성품 등록</DialogTitle>
          <DialogDescription>
            {targetDate} ({dayOfWeek}) — {mealPlanName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {availableDates.length > 0 && (
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                다른 날짜에서 복사
              </Label>
              <Select
                value={copySourceDisplay}
                onValueChange={(v) => {
                  // value가 표시값이므로 날짜 추출
                  const found = availableDates.find((d) => {
                    const plan = existingPlans.find((p) => p.date === d && p.mealPlanCode === mealPlanCode)
                    const dow = ["일", "월", "화", "수", "목", "금", "토"][new Date(d + "T00:00:00").getDay()]
                    return `${d} (${dow}) — ${plan?.items.length ?? 0}개 품목` === v
                  })
                  if (found) handleCopy(found)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((d) => {
                    const plan = existingPlans.find((p) => p.date === d && p.mealPlanCode === mealPlanCode)
                    const dow = ["일", "월", "화", "수", "목", "금", "토"][new Date(d + "T00:00:00").getDay()]
                    const label = `${d} (${dow}) — ${plan?.items.length ?? 0}개 품목`
                    return (
                      <SelectItem key={d} value={label}>
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              {copySource && (
                <p className="text-xs text-muted-foreground">
                  {copySource}의 구성품 {items.length}개가 복사되었습니다. 아래에서 수정 가능합니다.
                </p>
              )}
            </div>
          )}

          {/* 구성품 목록 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">구성품 ({items.length}개)</span>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSearch(!showSearch)}>
                <Plus className="h-3 w-3" />
                품목 추가
              </Button>
            </div>

            {items.length > 0 && (
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div key={item.zipCode} className="flex items-center gap-2 rounded border px-2 py-1.5 text-sm">
                    <Badge variant="outline" className="font-mono text-[10px]">{item.zipCode}</Badge>
                    <span className="flex-1 truncate">{item.productName}</span>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.zipCode, parseInt(e.target.value) || 1)}
                      className="h-7 w-14 text-center text-xs"
                    />
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeItem(item.zipCode)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {showSearch && (
              <div className="rounded-md border p-2 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="코드 또는 제품명 검색..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="h-8 pl-7 text-sm"
                    autoFocus
                  />
                </div>
                <ScrollArea className="h-[150px]">
                  <div className="space-y-0.5">
                    {products
                      .filter((p) => !items.some((i) => i.zipCode === p.code))
                      .map((product) => (
                        <button
                          key={product.code}
                          type="button"
                          onClick={() => addItem(product)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent text-left"
                        >
                          <span className="font-mono text-[10px] text-muted-foreground">{product.code}</span>
                          <span className="flex-1 truncate">{product.name}</span>
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </button>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <Badge variant="outline">{items.length}개 구성품</Badge>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
          <Button onClick={handleSave} disabled={items.length === 0 || isSubmitting}>
            {isSubmitting ? "저장 중..." : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
