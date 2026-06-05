"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { temperatureSchema, type TemperatureFormValues } from "@/lib/schemas/type-management"
import type { Temperature } from "@/types/type-management"
import { THRESHOLD_TYPE_LABELS } from "@/types/type-management"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface TemperatureFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem: Temperature | null
  onSubmit: (data: TemperatureFormValues) => void
}

export function TemperatureFormDialog({ open, onOpenChange, editItem, onSubmit }: TemperatureFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(temperatureSchema),
    defaultValues: { name: "", thresholdType: "BELOW" as const, minValue: null, maxValue: null, description: "" },
  })

  useEffect(() => {
    if (open) {
      if (editItem) {
        reset({ name: editItem.name, thresholdType: editItem.thresholdType, minValue: editItem.minValue, maxValue: editItem.maxValue, description: editItem.description })
      } else {
        reset({ name: "", thresholdType: "BELOW", minValue: null, maxValue: null, description: "" })
      }
    }
  }, [editItem, open, reset])

  const thresholdType = watch("thresholdType")
  const showMin = thresholdType === "ABOVE" || thresholdType === "RANGE"
  const showMax = thresholdType === "BELOW" || thresholdType === "RANGE"

  const handleFormSubmit = (data: TemperatureFormValues) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editItem ? "온도 유형 수정" : "온도 유형 추가"}</DialogTitle>
          <DialogDescription>
            {editItem ? `"${editItem.name}" 온도 유형을 수정합니다.` : "새로운 온도 유형을 등록합니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>명칭 *</Label>
            <Input {...register("name")} placeholder="예: 냉장 5°C 이하, 상온 18~25°C" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>임계 유형 *</Label>
            <Select
              value={THRESHOLD_TYPE_LABELS[thresholdType]}
              onValueChange={(val) => {
                const entry = Object.entries(THRESHOLD_TYPE_LABELS).find(([, l]) => l === val)
                if (entry) {
                  setValue("thresholdType", entry[0] as TemperatureFormValues["thresholdType"])
                  if (entry[0] === "BELOW") setValue("minValue", null)
                  if (entry[0] === "ABOVE") setValue("maxValue", null)
                }
              }}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(THRESHOLD_TYPE_LABELS).map((label) => (
                  <SelectItem key={label} value={label}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {thresholdType === "BELOW" && <p className="text-xs text-muted-foreground">최대 온도만 입력합니다.</p>}
            {thresholdType === "ABOVE" && <p className="text-xs text-muted-foreground">최소 온도만 입력합니다.</p>}
          </div>

          {showMin && (
            <div className="space-y-1.5">
              <Label>최소 온도 (°C)</Label>
              <Input type="number" value={watch("minValue") ?? ""} onChange={(e) => setValue("minValue", e.target.value === "" ? null : Number(e.target.value))} />
            </div>
          )}

          {showMax && (
            <div className="space-y-1.5">
              <Label>최대 온도 (°C)</Label>
              <Input type="number" value={watch("maxValue") ?? ""} onChange={(e) => setValue("maxValue", e.target.value === "" ? null : Number(e.target.value))} />
              {errors.maxValue && <p className="text-xs text-destructive">{errors.maxValue.message}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <Label>설명</Label>
            <Textarea {...register("description")} placeholder="선택 입력" rows={2} />
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
