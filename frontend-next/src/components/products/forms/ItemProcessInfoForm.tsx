"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { ItemDetailFormValues } from "@/lib/schemas/products"

export function ItemProcessInfoForm() {
  const { register } = useFormContext<ItemDetailFormValues>()

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">전처리</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.preprocessTotalWeight">전처리 총 중량</Label>
            <Input id="processInfo.preprocessTotalWeight" type="number" step="0.01" {...register("processInfo.preprocessTotalWeight", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.preprocessLossWeight">전처리 손실 중량</Label>
            <Input id="processInfo.preprocessLossWeight" type="number" step="0.01" {...register("processInfo.preprocessLossWeight", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">냉각</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.coolingTotalWeight">냉각 총 중량</Label>
            <Input id="processInfo.coolingTotalWeight" type="number" step="0.01" {...register("processInfo.coolingTotalWeight", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.coolingLossWeight">냉각 손실 중량</Label>
            <Input id="processInfo.coolingLossWeight" type="number" step="0.01" {...register("processInfo.coolingLossWeight", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.coolingTimeSeconds">냉각 시간 (초)</Label>
            <Input id="processInfo.coolingTimeSeconds" type="number" {...register("processInfo.coolingTimeSeconds", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">포장</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.packagingTotalWeight">포장 총 중량</Label>
            <Input id="processInfo.packagingTotalWeight" type="number" step="0.01" {...register("processInfo.packagingTotalWeight", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.packagingLossWeight">포장 손실 중량</Label>
            <Input id="processInfo.packagingLossWeight" type="number" step="0.01" {...register("processInfo.packagingLossWeight", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.laborTime">포장노무시간 (분)</Label>
            <Input id="processInfo.laborTime" type="number" {...register("processInfo.laborTime", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.expenseWeight">경비가중치</Label>
            <Input id="processInfo.expenseWeight" type="number" step="0.1" {...register("processInfo.expenseWeight", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">표준원가</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.standardMaterialCost">재료비 (원)</Label>
            <Input id="processInfo.standardMaterialCost" type="number" {...register("processInfo.standardMaterialCost", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.standardLaborCost">노무비 (원)</Label>
            <Input id="processInfo.standardLaborCost" type="number" {...register("processInfo.standardLaborCost", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.standardExpenseCost">경비 (원)</Label>
            <Input id="processInfo.standardExpenseCost" type="number" {...register("processInfo.standardExpenseCost", { valueAsNumber: true })} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">중량선별기</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.weightSorterNo2f">No_2F</Label>
            <Input id="processInfo.weightSorterNo2f" {...register("processInfo.weightSorterNo2f")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="processInfo.weightSorterNo3f">No_3F</Label>
            <Input id="processInfo.weightSorterNo3f" {...register("processInfo.weightSorterNo3f")} />
          </div>
        </div>
      </div>
    </div>
  )
}
