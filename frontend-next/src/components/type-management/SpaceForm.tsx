"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { spaceSchema, type SpaceFormValues } from "@/lib/schemas/type-management"
import type { Space, Temperature } from "@/types/type-management"
import { SPACE_TYPE_LABELS, CLEAN_ZONE_LABELS } from "@/types/type-management"
import { getTemperatures, getFloors } from "@/lib/api/type-management"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SpaceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem: Space | null
  onSubmit: (data: SpaceFormValues) => void
}

export function SpaceFormDialog({ open, onOpenChange, editItem, onSubmit }: SpaceFormProps) {
  const [temperatures, setTemperatures] = useState<Temperature[]>([])
  const [existingFloors, setExistingFloors] = useState<string[]>([])

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(spaceSchema),
    defaultValues: { name: "", spaceType: "WORKSHOP" as const, cleanZone: "GENERAL" as const, depth: 1, floor: "", temperatureName: null as string | null },
  })

  useEffect(() => {
    getTemperatures().then(setTemperatures)
    getFloors().then(setExistingFloors)
  }, [])

  useEffect(() => {
    if (open) {
      if (editItem) {
        reset({ name: editItem.name, spaceType: editItem.spaceType, cleanZone: editItem.cleanZone, depth: editItem.depth, floor: editItem.floor, temperatureName: editItem.temperatureName })
      } else {
        reset({ name: "", spaceType: "WORKSHOP", cleanZone: "GENERAL", depth: 1, floor: "", temperatureName: null })
      }
    }
  }, [editItem, open, reset])

  const spaceType = watch("spaceType")
  const cleanZone = watch("cleanZone")
  const depth = watch("depth")
  const floor = watch("floor")
  const temperatureName = watch("temperatureName")

  const handleFormSubmit = (data: SpaceFormValues) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editItem ? "공간 수정" : "공간 추가"}</DialogTitle>
          <DialogDescription>{editItem ? `"${editItem.name}" 공간을 수정합니다.` : "새로운 공간을 등록합니다."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* 공간 유형 - 토글 버튼 (RadioGroup 대체) */}
          <div className="space-y-1.5">
            <Label>공간 유형 *</Label>
            <div className="flex gap-2">
              {(Object.entries(SPACE_TYPE_LABELS) as [SpaceFormValues["spaceType"], string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setValue("spaceType", key)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    spaceType === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>공간명 *</Label>
              <Input {...register("name")} placeholder="공간명 입력" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>층 *</Label>
              <Select
                value={floor || "직접 입력"}
                onValueChange={(val) => {
                  if (val !== "직접 입력") setValue("floor", String(val))
                }}
              >
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {existingFloors.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  <SelectItem value="직접 입력">+ 새 층 직접 입력</SelectItem>
                </SelectContent>
              </Select>
              {(floor === "" || !existingFloors.includes(floor)) && (
                <Input
                  value={floor}
                  onChange={(e) => setValue("floor", e.target.value)}
                  placeholder="예: 1층, 지하층, 옥상"
                  className="mt-1"
                />
              )}
              {errors.floor && <p className="text-xs text-destructive">{errors.floor.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>청결구역</Label>
              <Select value={CLEAN_ZONE_LABELS[cleanZone]} onValueChange={(val) => {
                const entry = Object.entries(CLEAN_ZONE_LABELS).find(([, l]) => l === val)
                if (entry) setValue("cleanZone", entry[0] as SpaceFormValues["cleanZone"])
              }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(CLEAN_ZONE_LABELS).map((label) => <SelectItem key={label} value={label}>{label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>뎁스</Label>
              <Select value={depth === 1 ? "1뎁스 (최상위)" : `${depth}뎁스`} onValueChange={(val) => {
                const match = String(val).match(/^(\d+)/)
                if (match) setValue("depth", Number(match[1]))
              }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1뎁스 (최상위)">1뎁스 (최상위)</SelectItem>
                  <SelectItem value="2뎁스">2뎁스</SelectItem>
                  <SelectItem value="3뎁스">3뎁스</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>온도 유형</Label>
            <Select value={temperatureName ?? "— 선택 —"} onValueChange={(val) => setValue("temperatureName", val === "— 선택 —" ? null : val)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="— 선택 —">— 선택 —</SelectItem>
                {temperatures.map((t) => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button type="submit">{editItem ? "수정" : "추가"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
