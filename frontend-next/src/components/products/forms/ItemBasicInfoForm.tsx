"use client"

import { useFormContext } from "react-hook-form"
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
  ITEM_TYPE_LABELS,
  STORAGE_METHOD_LABELS,
  UNIT_LABELS,
} from "@/types/products"
import type { ItemDetailFormValues } from "@/lib/schemas/products"

interface ItemBasicInfoFormProps {
  isEdit: boolean
}

export function ItemBasicInfoForm({ isEdit }: ItemBasicInfoFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ItemDetailFormValues>()

  const basicErrors = errors.basic

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="basic.code">품목코드 *</Label>
        <Input
          id="basic.code"
          {...register("basic.code")}
          disabled={isEdit}
          placeholder="예: FP-0001"
          aria-invalid={!!basicErrors?.code}
        />
        {basicErrors?.code && <p className="text-xs text-red-500">{basicErrors.code.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.name">품목명 *</Label>
        <Input
          id="basic.name"
          {...register("basic.name")}
          placeholder="품목명 입력"
          aria-invalid={!!basicErrors?.name}
        />
        {basicErrors?.name && <p className="text-xs text-red-500">{basicErrors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>품목구분</Label>
        <Select
          value={watch("basic.type") ?? ""}
          onValueChange={(val) => setValue("basic.type", val as ItemDetailFormValues["basic"]["type"])}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택">
              {ITEM_TYPE_LABELS[watch("basic.type") as keyof typeof ITEM_TYPE_LABELS] ?? "선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ITEM_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.category">구분값</Label>
        <Input id="basic.category" {...register("basic.category")} placeholder="식단, 세트 등" />
      </div>

      <div className="space-y-1.5">
        <Label>단위</Label>
        <Select
          value={watch("basic.unit") ?? ""}
          onValueChange={(val) => setValue("basic.unit", val as ItemDetailFormValues["basic"]["unit"])}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택">
              {UNIT_LABELS[watch("basic.unit") as keyof typeof UNIT_LABELS] ?? "선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(UNIT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.weightPerUnit">단위당 중량</Label>
        <Input id="basic.weightPerUnit" {...register("basic.weightPerUnit")} placeholder="예: 200g" />
      </div>

      <div className="space-y-1.5">
        <Label>보관방법</Label>
        <Select
          value={watch("basic.storageMethod") ?? ""}
          onValueChange={(val) => setValue("basic.storageMethod", val as ItemDetailFormValues["basic"]["storageMethod"])}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택">
              {STORAGE_METHOD_LABELS[watch("basic.storageMethod") as keyof typeof STORAGE_METHOD_LABELS] ?? "선택"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STORAGE_METHOD_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.purchasePrice">입고단가 (원)</Label>
        <Input id="basic.purchasePrice" type="number" {...register("basic.purchasePrice", { valueAsNumber: true })} placeholder="0" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.purchaseVat">입고부가세 (%)</Label>
        <Input id="basic.purchaseVat" type="number" {...register("basic.purchaseVat", { valueAsNumber: true })} placeholder="10" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.salePrice">권장판매가 (원)</Label>
        <Input id="basic.salePrice" type="number" {...register("basic.salePrice", { valueAsNumber: true })} placeholder="0" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.saleVat">권장판매부가세 (%)</Label>
        <Input id="basic.saleVat" type="number" {...register("basic.saleVat", { valueAsNumber: true })} placeholder="10" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.companyId">거래처</Label>
        <Input id="basic.companyId" {...register("basic.companyId")} placeholder="거래처명" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.moq">최소 구매단위</Label>
        <Input id="basic.moq" type="number" {...register("basic.moq", { valueAsNumber: true })} />
      </div>

      <div className="space-y-1.5">
        <Label>재고수량관리</Label>
        <Select
          value={watch("basic.stockControl") ?? "Y"}
          onValueChange={(val) => setValue("basic.stockControl", val as "Y" | "N")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택">{watch("basic.stockControl") ?? "Y"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Y">Y</SelectItem>
            <SelectItem value="N">N</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.safetyStockQty">안전재고수량</Label>
        <Input id="basic.safetyStockQty" type="number" {...register("basic.safetyStockQty", { valueAsNumber: true })} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.leadTimeDays">리드타임 (일)</Label>
        <Input id="basic.leadTimeDays" type="number" {...register("basic.leadTimeDays", { valueAsNumber: true })} />
      </div>

      <div className="space-y-1.5">
        <Label>세트여부</Label>
        <Select
          value={watch("basic.isSet") ?? "N"}
          onValueChange={(val) => setValue("basic.isSet", val as "Y" | "N")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택">{watch("basic.isSet") ?? "N"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Y">Y</SelectItem>
            <SelectItem value="N">N</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.productBarcode">제품 바코드</Label>
        <Input id="basic.productBarcode" {...register("basic.productBarcode")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.outerBoxBarcode">외박스 바코드</Label>
        <Input id="basic.outerBoxBarcode" {...register("basic.outerBoxBarcode")} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.unitsPerBox">박스당 수량</Label>
        <Input id="basic.unitsPerBox" type="number" {...register("basic.unitsPerBox", { valueAsNumber: true })} />
      </div>

      <div className="space-y-1.5">
        <Label>사용여부</Label>
        <Select
          value={watch("basic.isActive") ?? "Y"}
          onValueChange={(val) => setValue("basic.isActive", val as "Y" | "N")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선택">{watch("basic.isActive") ?? "Y"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Y">Y</SelectItem>
            <SelectItem value="N">N</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="basic.deactivationReason">변경 사유</Label>
        <Input id="basic.deactivationReason" {...register("basic.deactivationReason")} />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="basic.note">적요</Label>
        <Textarea id="basic.note" {...register("basic.note")} placeholder="메모사항" rows={3} />
      </div>
    </div>
  )
}
