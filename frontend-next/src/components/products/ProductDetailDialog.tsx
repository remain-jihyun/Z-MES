"use client"

import { useEffect, useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ban, RotateCcw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { itemDetailSchema, type ItemDetailFormValues } from "@/lib/schemas/products"
import { getItemByCode, createItem, updateItem, deactivateItem, reactivateItem } from "@/lib/api/products"
import type { ItemDetail, SalesChannel } from "@/types/products"
import { ItemBasicInfoForm } from "./forms/ItemBasicInfoForm"
import { ItemProcessInfoForm } from "./forms/ItemProcessInfoForm"
import { ItemQualityForm } from "./forms/ItemQualityForm"
import { ItemSalesChannelsForm } from "./forms/ItemSalesChannelsForm"

interface ProductDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editCode: string | null
  onSaved: () => void
}

const EMPTY_CHANNEL: SalesChannel = {
  name: null, code: null, barcode: null, quantity: null, price: null,
  sellStatus: null, releasedAt: null, discontinuedAt: null, discontinuedReason: null,
}

const DEFAULT_VALUES: ItemDetailFormValues = {
  basic: {
    code: "", name: "", category: null, unit: "EA", weightPerUnit: null,
    storageMethod: "REFRIGERATED", type: "FINISHED_PRODUCT",
    purchasePrice: 0, purchaseVat: 10, salePrice: 0, saleVat: 10,
    companyId: null, moq: null, stockControl: "Y", safetyStockQty: null,
    leadTimeDays: null, note: null, productBarcode: null, outerBoxBarcode: null,
    unitsPerBox: null, isSet: "N", isActive: "Y", deactivationReason: null,
  },
  processInfo: {
    preprocessTotalWeight: null, preprocessLossWeight: null,
    coolingTotalWeight: null, coolingLossWeight: null, coolingTimeSeconds: null,
    packagingTotalWeight: null, packagingLossWeight: null,
    laborTime: null, expenseWeight: null,
    standardMaterialCost: null, standardLaborCost: null, standardExpenseCost: null,
    weightSorterNo2f: null, weightSorterNo3f: null,
  },
  quality: {
    reportNumber: null, reportDate: null, reportFileId: null,
    foodType: null, sterilizationType: null, expirationPeriod: null,
    labeling: null, allergyLabeling: null, labelingForProduct: null,
    dominoFileId: null, dominoImageId: null, calorie: null,
    storageInstruction: null, isHaccp: null,
    mainIngredient: null, mainIngredientRate: null, allergyIngredients: null,
    manufacturer: null, manufacturerAddress: null,
    repacker: null, repackerAddress: null,
    supplier: null, supplierAddress: null,
    returnAddress: null, customerServiceTel: null,
    packagingMaterial: null, commonLabeling: null,
  },
  salesChannels: {
    store: { ...EMPTY_CHANNEL },
    coupang: { ...EMPTY_CHANNEL },
    kurly: { ...EMPTY_CHANNEL },
  },
}

function itemToForm(item: ItemDetail): ItemDetailFormValues {
  return {
    basic: {
      code: item.code, name: item.name, category: item.category,
      unit: item.unit, weightPerUnit: item.weightPerUnit,
      storageMethod: item.storageMethod, type: item.type,
      purchasePrice: item.purchasePrice, purchaseVat: item.purchaseVat,
      salePrice: item.salePrice, saleVat: item.saleVat,
      companyId: item.companyId, moq: item.moq,
      stockControl: item.stockControl, safetyStockQty: item.safetyStockQty,
      leadTimeDays: item.leadTimeDays, note: item.note,
      productBarcode: item.productBarcode, outerBoxBarcode: item.outerBoxBarcode,
      unitsPerBox: item.unitsPerBox, isSet: item.isSet,
      isActive: item.isActive, deactivationReason: item.deactivationReason,
    },
    processInfo: { ...item.processInfo },
    quality: { ...item.quality },
    salesChannels: {
      store: { ...item.salesChannels.store },
      coupang: { ...item.salesChannels.coupang },
      kurly: { ...item.salesChannels.kurly },
    },
  }
}

function formToItem(values: ItemDetailFormValues): ItemDetail {
  return {
    ...values.basic,
    processInfo: values.processInfo,
    quality: values.quality,
    salesChannels: values.salesChannels,
  }
}

export function ProductDetailDialog({
  open,
  onOpenChange,
  editCode,
  onSaved,
}: ProductDetailDialogProps) {
  const isEdit = editCode !== null
  const [item, setItem] = useState<ItemDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [deactivateReason, setDeactivateReason] = useState("")

  const isActive = item?.isActive !== "N"

  const methods = useForm({
    resolver: zodResolver(itemDetailSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (!open) {
      setItem(null)
      setDeactivateOpen(false)
      setDeactivateReason("")
      return
    }
    if (isEdit && editCode) {
      setLoading(true)
      getItemByCode(editCode).then((found) => {
        setItem(found)
        if (found) methods.reset(itemToForm(found))
        setLoading(false)
      })
    } else {
      methods.reset(DEFAULT_VALUES)
    }
  }, [open, isEdit, editCode, methods])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      const data = formToItem(values)
      if (isEdit && editCode) {
        await updateItem(editCode, data)
      } else {
        await createItem(data)
      }
      onOpenChange(false)
      onSaved()
    } catch {
      // TODO: 에러 처리
    }
  }

  const handleDeactivate = async () => {
    if (!editCode || !deactivateReason.trim()) return
    try {
      await deactivateItem(editCode, deactivateReason.trim())
      setDeactivateOpen(false)
      setDeactivateReason("")
      onOpenChange(false)
      onSaved()
    } catch {
      // TODO: 에러 처리
    }
  }

  const handleReactivate = async () => {
    if (!editCode) return
    try {
      await reactivateItem(editCode)
      onOpenChange(false)
      onSaved()
    } catch {
      // TODO: 에러 처리
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col" showCloseButton>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>
                {isEdit ? `품목 상세 — ${editCode}` : "품목 등록"}
              </DialogTitle>
              {isEdit && !isActive && (
                <Badge className="text-[10px] bg-red-100 text-red-700">사용중단</Badge>
              )}
            </div>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-4 min-h-0">
                <Tabs defaultValue="basic" className="min-h-0">
                  <TabsList>
                    <TabsTrigger value="basic">기본정보</TabsTrigger>
                    <TabsTrigger value="process">공정정보</TabsTrigger>
                    <TabsTrigger value="quality">품질정보</TabsTrigger>
                    <TabsTrigger value="sales">판매채널</TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-[50vh]">
                    <div className="py-4">
                      <TabsContent value="basic">
                        <ItemBasicInfoForm isEdit={isEdit} />
                      </TabsContent>
                      <TabsContent value="process">
                        <ItemProcessInfoForm />
                      </TabsContent>
                      <TabsContent value="quality">
                        <ItemQualityForm />
                      </TabsContent>
                      <TabsContent value="sales">
                        <ItemSalesChannelsForm />
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </Tabs>

                <DialogFooter className="flex-row justify-between sm:justify-between">
                  <div className="flex items-center gap-2">
                    {isEdit && isActive && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:text-red-600"
                        onClick={() => setDeactivateOpen(true)}
                      >
                        <Ban className="size-3.5" />
                        사용중단
                      </Button>
                    )}
                    {isEdit && !isActive && (
                      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={handleReactivate}>
                        <RotateCcw className="size-3.5" />
                        다시사용
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
                    <Button type="submit">{isEdit ? "수정" : "등록"}</Button>
                  </div>
                </DialogFooter>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>

      {/* 사용중단 사유 입력 */}
      <Dialog open={deactivateOpen} onOpenChange={setDeactivateOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>사용중단</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="deactivate-reason">사용중단 사유 *</Label>
            <Textarea
              id="deactivate-reason"
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              placeholder="사용중단 사유를 입력해주세요"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateOpen(false)}>취소</Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeactivate}
              disabled={!deactivateReason.trim()}
            >
              사용중단
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
