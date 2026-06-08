"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getItems } from "@/lib/api/products"
import { Plus, X, Search } from "lucide-react"
import type { DailyMealPlan, MealPlanType, MealPlanItem } from "@/types/meal-plan"
import type { ItemDetail } from "@/types/products"

const itemSchema = z.object({
  zipCode: z.string(),
  productName: z.string(),
  weight: z.string(),
  quantity: z.number().min(1),
})

const createSchema = z.object({
  mealPlanCode: z.string().min(1, "식단 유형을 선택해주세요"),
  startDate: z.string().min(1, "시작일을 입력해주세요"),
  endDate: z.string().min(1, "종료일을 입력해주세요"),
  items: z.array(itemSchema).min(1, "구성품을 1개 이상 추가해주세요"),
})

const editSchema = z.object({
  items: z.array(itemSchema).min(1, "구성품을 1개 이상 추가해주세요"),
})

type CreateFormData = z.infer<typeof createSchema>
type EditFormData = z.infer<typeof editSchema>

interface ScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPlan: DailyMealPlan | null
  mealPlanTypes: MealPlanType[]
  defaultMealPlanCode: string
  onSave: (data: {
    startDate: string
    endDate: string
    mealPlanCode: string
    mealPlanName: string
    items: DailyMealPlan["items"]
  }) => void
  isSubmitting: boolean
}

function MealItemSelector({ selectedItems, onChange }: { selectedItems: MealPlanItem[]; onChange: (items: MealPlanItem[]) => void }) {
  const [keyword, setKeyword] = useState("")
  const [products, setProducts] = useState<ItemDetail[]>([])
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    if (!showSearch) return
    const timer = setTimeout(async () => {
      const result = await getItems({ search: keyword || undefined, pageSize: 50 })
      setProducts(result.data)
    }, 200)
    return () => clearTimeout(timer)
  }, [keyword, showSearch])

  const addItem = (product: ItemDetail) => {
    if (selectedItems.some((i) => i.zipCode === product.code)) return
    const weight = product.weightPerUnit ?? ""
    onChange([...selectedItems, { zipCode: product.code, productName: product.name, weight, quantity: 1 }])
  }

  const removeItem = (zipCode: string) => {
    onChange(selectedItems.filter((i) => i.zipCode !== zipCode))
  }

  const updateQuantity = (zipCode: string, quantity: number) => {
    onChange(selectedItems.map((i) => i.zipCode === zipCode ? { ...i, quantity: Math.max(1, quantity) } : i))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">구성품 ({selectedItems.length}개)</span>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowSearch(!showSearch)}>
          <Plus className="h-3 w-3" />
          품목 추가
        </Button>
      </div>

      {selectedItems.length > 0 && (
        <div className="space-y-1.5">
          {selectedItems.map((item) => (
            <div key={item.zipCode} className="flex items-center gap-2 rounded border px-2 py-1.5 text-sm">
              <Badge variant="outline" className="font-mono text-[10px]">{item.zipCode}</Badge>
              <span className="flex-1 truncate">{item.productName}</span>
              <span className="shrink-0 text-[10px] text-muted-foreground">{item.weight}</span>
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
                .filter((p) => !selectedItems.some((i) => i.zipCode === p.code))
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
  )
}

export function ScheduleDialog({
  open,
  onOpenChange,
  editingPlan,
  mealPlanTypes,
  defaultMealPlanCode,
  onSave,
  isSubmitting,
}: ScheduleDialogProps) {
  const isEdit = !!editingPlan
  const todayStr = () => new Date().toISOString().slice(0, 10)

  const createForm = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: {
      mealPlanCode: defaultMealPlanCode,
      startDate: todayStr(),
      endDate: todayStr(),
      items: [] as MealPlanItem[],
    },
  })

  const editForm = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: { items: [] as MealPlanItem[] },
  })

  useEffect(() => {
    if (open) {
      if (editingPlan) {
        editForm.reset({ items: editingPlan.items })
      } else {
        createForm.reset({
          mealPlanCode: defaultMealPlanCode,
          startDate: todayStr(),
          endDate: todayStr(),
          items: [],
        })
      }
    }
  }, [open, editingPlan, defaultMealPlanCode, createForm, editForm])

  const onCreateSubmit = (data: CreateFormData) => {
    const mealPlanName = mealPlanTypes.find((t) => t.code === data.mealPlanCode)?.name ?? ""
    onSave({ mealPlanCode: data.mealPlanCode, mealPlanName, startDate: data.startDate, endDate: data.endDate, items: data.items })
  }

  const onEditSubmit = (data: EditFormData) => {
    if (!editingPlan) return
    onSave({
      mealPlanCode: editingPlan.mealPlanCode,
      mealPlanName: editingPlan.mealPlanName,
      startDate: editingPlan.date,
      endDate: editingPlan.date,
      items: data.items,
    })
  }

  const selectedCode = createForm.watch("mealPlanCode")
  const selectedType = mealPlanTypes.find((t) => t.code === selectedCode)
  const selectedName = mealPlanTypes.find((t) => t.code === selectedCode)?.name ?? ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `구성품 수정 — ${editingPlan.date}` : "식단 배치 등록"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `${editingPlan.mealPlanName}의 구성품을 수정합니다.`
              : "기간을 지정하면 각 날짜별로 동일한 구성품이 등록됩니다."}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <Controller
              name="items"
              control={editForm.control}
              render={({ field }) => (
                <MealItemSelector selectedItems={field.value} onChange={field.onChange} />
              )}
            />
            {editForm.formState.errors.items && (
              <p className="text-xs text-destructive">{editForm.formState.errors.items.message}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "저장 중..." : "수정"}</Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>식단 유형 *</Label>
              <Select
                value={selectedName || "— 선택 —"}
                onValueChange={(v) => {
                  if (v === "— 선택 —") return
                  const found = mealPlanTypes.find((t) => t.name === v)
                  if (found) createForm.setValue("mealPlanCode", found.code)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="— 선택 —">— 선택 —</SelectItem>
                  {[...mealPlanTypes].sort((a, b) => a.name.localeCompare(b.name, "ko")).map((t) => (
                    <SelectItem key={t.code} value={t.name}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedType && (
                <p className="text-xs text-muted-foreground">{selectedType.description}</p>
              )}
              {createForm.formState.errors.mealPlanCode && (
                <p className="text-xs text-destructive">{createForm.formState.errors.mealPlanCode.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>시작일 *</Label>
                <Input type="date" {...createForm.register("startDate")} />
                {createForm.formState.errors.startDate && (
                  <p className="text-xs text-destructive">{createForm.formState.errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>종료일 *</Label>
                <Input type="date" {...createForm.register("endDate")} />
                {createForm.formState.errors.endDate && (
                  <p className="text-xs text-destructive">{createForm.formState.errors.endDate.message}</p>
                )}
              </div>
            </div>

            <Controller
              name="items"
              control={createForm.control}
              render={({ field }) => (
                <MealItemSelector selectedItems={field.value} onChange={field.onChange} />
              )}
            />
            {createForm.formState.errors.items && (
              <p className="text-xs text-destructive">{createForm.formState.errors.items.message}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "저장 중..." : "등록"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
