"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { processSchema, type ProcessFormValues } from "@/lib/schemas/type-management"
import type { Process, Space } from "@/types/type-management"
import { getSpaces } from "@/lib/api/type-management"
import { mockEquipments, mockDevices } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ProcessFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem: Process | null
  defaultSpaceName?: string
  onSubmit: (data: ProcessFormValues) => void
}

export function ProcessFormDialog({ open, onOpenChange, editItem, defaultSpaceName, onSubmit }: ProcessFormProps) {
  const [spaces, setSpaces] = useState<Space[]>([])

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(processSchema),
    defaultValues: {
      name: "", spaceName: "",
      isCcp: false, isInspection: false, isCooling: false,
      createKanban: true, deviceId: null as string | null, equipmentName: null as string | null,
      description: null as string | null,
    },
  })

  useEffect(() => { getSpaces().then(setSpaces) }, [])

  useEffect(() => {
    if (open) {
      if (editItem) {
        reset({
          name: editItem.name, spaceName: editItem.spaceName,
          isCcp: editItem.isCcp, isInspection: editItem.isInspection, isCooling: editItem.isCooling,
          createKanban: editItem.createKanban ?? true,
          deviceId: editItem.deviceId ?? null,
          equipmentName: editItem.equipmentName ?? null,
          description: editItem.description,
        })
      } else {
        reset({
          name: "", spaceName: defaultSpaceName ?? "",
          isCcp: false, isInspection: false, isCooling: false,
          createKanban: true, deviceId: null, equipmentName: null, description: null,
        })
      }
    }
  }, [editItem, defaultSpaceName, open, reset])

  const spaceName = watch("spaceName")
  const isCcp = watch("isCcp")
  const isInspection = watch("isInspection")
  const isCooling = watch("isCooling")
  const createKanban = watch("createKanban")
  const deviceId = watch("deviceId")
  const equipmentName = watch("equipmentName")

  const handleFormSubmit = (data: ProcessFormValues) => {
    onSubmit(data)
    onOpenChange(false)
  }

  const ToggleRow = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow transition-transform", checked ? "translate-x-4" : "translate-x-0.5")} />
      </button>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editItem ? "공정 수정" : "공정 추가"}</DialogTitle>
          <DialogDescription>
            {editItem ? `"${editItem.spaceName} > ${editItem.name}" 공정을 수정합니다.` : "새로운 공정을 등록합니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>공정명 *</Label>
            <Input {...register("name")} placeholder="예: 칼기, 세척, 조리, 내포장" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>공간 매칭 *</Label>
            <Select value={spaceName || "— 선택 —"} onValueChange={(val) => setValue("spaceName", val === "— 선택 —" ? "" : String(val))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="— 선택 —">— 선택 —</SelectItem>
                {spaces.filter((s) => s.spaceType === "WORKSHOP").map((s) => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.spaceName && <p className="text-xs text-destructive">{errors.spaceName.message}</p>}
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>공정 속성</Label>
            <ToggleRow label="간반 생성" description="이 공정에서 간반을 생성합니다" checked={createKanban} onChange={(v) => setValue("createKanban", v)} />
            <ToggleRow label="CCP" description="위해요소 중점관리 공정" checked={isCcp} onChange={(v) => setValue("isCcp", v)} />
            <ToggleRow label="검수" description="검수 공정 여부" checked={isInspection} onChange={(v) => setValue("isInspection", v)} />
            <ToggleRow label="냉각" description="냉각 공정 여부" checked={isCooling} onChange={(v) => setValue("isCooling", v)} />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>설비 / 디바이스 설정</Label>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">담당 설비</p>
              <Select value={equipmentName ?? "— 없음 —"} onValueChange={(val) => setValue("equipmentName", val === "— 없음 —" ? null : val)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="— 없음 —">— 없음 —</SelectItem>
                  {mockEquipments.map(e => (
                    <SelectItem key={e.code} value={e.name}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">연결 디바이스</p>
              <Select value={deviceId ?? "— 없음 —"} onValueChange={(val) => setValue("deviceId", val === "— 없음 —" ? null : val)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="— 없음 —">— 없음 —</SelectItem>
                  {mockDevices.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.id} ({d.type})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
