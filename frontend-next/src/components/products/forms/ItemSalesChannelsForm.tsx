"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SELL_STATUS_LABELS } from "@/types/products"
import type { ItemDetailFormValues } from "@/lib/schemas/products"
import type { SellStatus } from "@/types/products"

type ChannelKey = "store" | "coupang" | "kurly"

const CHANNEL_LABELS: Record<ChannelKey, string> = {
  store: "자사몰",
  coupang: "쿠팡",
  kurly: "컬리",
}

function ChannelSection({ channel }: { channel: ChannelKey }) {
  const { register, watch, setValue } = useFormContext<ItemDetailFormValues>()
  const prefix = `salesChannels.${channel}` as const

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">{CHANNEL_LABELS[channel]}</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.name`}>상품명</Label>
          <Input id={`${prefix}.name`} {...register(`${prefix}.name`)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.code`}>상품코드</Label>
          <Input id={`${prefix}.code`} {...register(`${prefix}.code`)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.barcode`}>바코드</Label>
          <Input id={`${prefix}.barcode`} {...register(`${prefix}.barcode`)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.quantity`}>입수량</Label>
          <Input id={`${prefix}.quantity`} type="number" {...register(`${prefix}.quantity`, { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.price`}>권장 판매가 (원)</Label>
          <Input id={`${prefix}.price`} type="number" {...register(`${prefix}.price`, { valueAsNumber: true })} />
        </div>
        <div className="space-y-1.5">
          <Label>판매 여부</Label>
          <Select
            value={watch(`${prefix}.sellStatus`) ?? ""}
            onValueChange={(val) => setValue(`${prefix}.sellStatus`, (val || null) as SellStatus | null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="선택">
                {SELL_STATUS_LABELS[watch(`${prefix}.sellStatus`) as SellStatus] ?? "선택"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SELL_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.releasedAt`}>출시일</Label>
          <Input id={`${prefix}.releasedAt`} type="date" {...register(`${prefix}.releasedAt`)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.discontinuedAt`}>중단일</Label>
          <Input id={`${prefix}.discontinuedAt`} type="date" {...register(`${prefix}.discontinuedAt`)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${prefix}.discontinuedReason`}>중단 사유</Label>
          <Input id={`${prefix}.discontinuedReason`} {...register(`${prefix}.discontinuedReason`)} />
        </div>
      </div>
    </div>
  )
}

export function ItemSalesChannelsForm() {
  return (
    <div className="space-y-6">
      <ChannelSection channel="store" />
      <Separator />
      <ChannelSection channel="coupang" />
      <Separator />
      <ChannelSection channel="kurly" />
    </div>
  )
}
