"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { ItemDetailFormValues } from "@/lib/schemas/products"

export function ItemQualityForm() {
  const { register, watch, setValue } = useFormContext<ItemDetailFormValues>()

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">품목보고</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quality.reportNumber">품목보고번호</Label>
            <Input id="quality.reportNumber" {...register("quality.reportNumber")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.reportDate">보고일자</Label>
            <Input id="quality.reportDate" type="date" {...register("quality.reportDate")} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">식품 정보</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quality.foodType">식품유형</Label>
            <Input id="quality.foodType" {...register("quality.foodType")} placeholder="예: 즉석조리식품" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.sterilizationType">살균/멸균 여부</Label>
            <Input id="quality.sterilizationType" {...register("quality.sterilizationType")} placeholder="예: 살균, 멸균" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.expirationPeriod">소비기한</Label>
            <Input id="quality.expirationPeriod" {...register("quality.expirationPeriod")} placeholder="예: 180일" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.calorie">총 열량 (kcal)</Label>
            <Input id="quality.calorie" type="number" {...register("quality.calorie", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.storageInstruction">보관방법</Label>
            <Input id="quality.storageInstruction" {...register("quality.storageInstruction")} placeholder="예: 냉동보관(-18℃ 이하)" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.packagingMaterial">포장재질</Label>
            <Input id="quality.packagingMaterial" {...register("quality.packagingMaterial")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.mainIngredient">주원재료명</Label>
            <Input id="quality.mainIngredient" {...register("quality.mainIngredient")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.mainIngredientRate">원재료 함량 (%)</Label>
            <Input id="quality.mainIngredientRate" type="number" step="0.1" {...register("quality.mainIngredientRate", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.allergyIngredients">알레르기 유발 원재료</Label>
            <Input id="quality.allergyIngredients" {...register("quality.allergyIngredients")} />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <input
              type="checkbox"
              id="quality.isHaccp"
              checked={watch("quality.isHaccp") ?? false}
              onChange={(e) => setValue("quality.isHaccp", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="quality.isHaccp">HACCP 인증</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">표시사항</h4>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="quality.labeling">표시사항</Label>
            <Textarea id="quality.labeling" {...register("quality.labeling")} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.allergyLabeling">알레르기 표시사항</Label>
            <Textarea id="quality.allergyLabeling" {...register("quality.allergyLabeling")} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.labelingForProduct">제품 표시사항</Label>
            <Textarea id="quality.labelingForProduct" {...register("quality.labelingForProduct")} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.commonLabeling">공통표시사항</Label>
            <Textarea id="quality.commonLabeling" {...register("quality.commonLabeling")} rows={2} />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">업체 정보</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="quality.manufacturer">제조원</Label>
            <Input id="quality.manufacturer" {...register("quality.manufacturer")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.manufacturerAddress">제조원 주소</Label>
            <Input id="quality.manufacturerAddress" {...register("quality.manufacturerAddress")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.repacker">소분원</Label>
            <Input id="quality.repacker" {...register("quality.repacker")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.repackerAddress">소분원 주소</Label>
            <Input id="quality.repackerAddress" {...register("quality.repackerAddress")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.supplier">판매원</Label>
            <Input id="quality.supplier" {...register("quality.supplier")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.supplierAddress">판매원 주소</Label>
            <Input id="quality.supplierAddress" {...register("quality.supplierAddress")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.returnAddress">반품 및 교환장소</Label>
            <Input id="quality.returnAddress" {...register("quality.returnAddress")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quality.customerServiceTel">소비자 상담실</Label>
            <Input id="quality.customerServiceTel" {...register("quality.customerServiceTel")} />
          </div>
        </div>
      </div>
    </div>
  )
}
