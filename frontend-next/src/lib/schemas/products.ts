import { z } from "zod"

export const itemBasicInfoSchema = z.object({
  code: z.string().min(1, "품목코드를 입력해주세요"),
  name: z.string().min(1, "품목명을 입력해주세요"),
  category: z.string().nullable(),
  unit: z.enum(["EA", "kg", "BOX", "L", "ROLL"]).nullable(),
  weightPerUnit: z.string().nullable(),
  storageMethod: z.enum(["FROZEN", "REFRIGERATED", "ROOM_TEMPERATURE"]).nullable(),
  type: z.enum(["FINISHED_PRODUCT", "SEMI_FINISHED", "RAW_MATERIAL", "MERCHANDISE", "SUB_MATERIAL"]).nullable(),
  purchasePrice: z.coerce.number().nullable(),
  purchaseVat: z.coerce.number().nullable(),
  salePrice: z.coerce.number().nullable(),
  saleVat: z.coerce.number().nullable(),
  companyId: z.string().nullable(),
  moq: z.coerce.number().nullable(),
  stockControl: z.enum(["Y", "N"]).nullable(),
  safetyStockQty: z.coerce.number().nullable(),
  leadTimeDays: z.coerce.number().nullable(),
  note: z.string().nullable(),
  productBarcode: z.string().nullable(),
  outerBoxBarcode: z.string().nullable(),
  unitsPerBox: z.coerce.number().nullable(),
  isSet: z.enum(["Y", "N"]).nullable(),
  isActive: z.enum(["Y", "N"]).nullable(),
  deactivationReason: z.string().nullable(),
})

export const itemProcessInfoSchema = z.object({
  preprocessTotalWeight: z.coerce.number().nullable(),
  preprocessLossWeight: z.coerce.number().nullable(),
  coolingTotalWeight: z.coerce.number().nullable(),
  coolingLossWeight: z.coerce.number().nullable(),
  coolingTimeSeconds: z.coerce.number().nullable(),
  packagingTotalWeight: z.coerce.number().nullable(),
  packagingLossWeight: z.coerce.number().nullable(),
  laborTime: z.coerce.number().nullable(),
  expenseWeight: z.coerce.number().nullable(),
  standardMaterialCost: z.coerce.number().nullable(),
  standardLaborCost: z.coerce.number().nullable(),
  standardExpenseCost: z.coerce.number().nullable(),
  weightSorterNo2f: z.string().nullable(),
  weightSorterNo3f: z.string().nullable(),
})

export const itemQualitySchema = z.object({
  reportNumber: z.string().nullable(),
  reportDate: z.string().nullable(),
  reportFileId: z.string().nullable(),
  foodType: z.string().nullable(),
  sterilizationType: z.string().nullable(),
  expirationPeriod: z.string().nullable(),
  labeling: z.string().nullable(),
  allergyLabeling: z.string().nullable(),
  labelingForProduct: z.string().nullable(),
  dominoFileId: z.string().nullable(),
  dominoImageId: z.string().nullable(),
  calorie: z.coerce.number().nullable(),
  storageInstruction: z.string().nullable(),
  isHaccp: z.boolean().nullable(),
  mainIngredient: z.string().nullable(),
  mainIngredientRate: z.coerce.number().nullable(),
  allergyIngredients: z.string().nullable(),
  manufacturer: z.string().nullable(),
  manufacturerAddress: z.string().nullable(),
  repacker: z.string().nullable(),
  repackerAddress: z.string().nullable(),
  supplier: z.string().nullable(),
  supplierAddress: z.string().nullable(),
  returnAddress: z.string().nullable(),
  customerServiceTel: z.string().nullable(),
  packagingMaterial: z.string().nullable(),
  commonLabeling: z.string().nullable(),
})

export const salesChannelSchema = z.object({
  name: z.string().nullable(),
  code: z.string().nullable(),
  barcode: z.string().nullable(),
  quantity: z.coerce.number().nullable(),
  price: z.coerce.number().nullable(),
  sellStatus: z.enum(["SELLING", "DISCONTINUED", "ON_HOLD"]).nullable(),
  releasedAt: z.string().nullable(),
  discontinuedAt: z.string().nullable(),
  discontinuedReason: z.string().nullable(),
})

export const itemDetailSchema = z.object({
  basic: itemBasicInfoSchema,
  processInfo: itemProcessInfoSchema,
  quality: itemQualitySchema,
  salesChannels: z.object({
    store: salesChannelSchema,
    coupang: salesChannelSchema,
    kurly: salesChannelSchema,
  }),
})

export type ItemDetailFormValues = z.infer<typeof itemDetailSchema>
