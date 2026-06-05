export type ItemType =
  | "FINISHED_PRODUCT"
  | "SEMI_FINISHED"
  | "RAW_MATERIAL"
  | "MERCHANDISE"
  | "SUB_MATERIAL"

export type ItemUnit = "EA" | "kg" | "BOX" | "L" | "ROLL"

export type StorageMethod = "FROZEN" | "REFRIGERATED" | "ROOM_TEMPERATURE"

export type YesNo = "Y" | "N"

export type SellStatus = "SELLING" | "DISCONTINUED" | "ON_HOLD"

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  FINISHED_PRODUCT: "제품",
  SEMI_FINISHED: "반제품",
  RAW_MATERIAL: "원재료",
  MERCHANDISE: "상품",
  SUB_MATERIAL: "부재료",
}

export const STORAGE_METHOD_LABELS: Record<StorageMethod, string> = {
  FROZEN: "냉동",
  REFRIGERATED: "냉장",
  ROOM_TEMPERATURE: "상온",
}

export const UNIT_LABELS: Record<ItemUnit, string> = {
  EA: "EA",
  kg: "kg",
  BOX: "BOX",
  L: "L",
  ROLL: "ROLL",
}

export const SELL_STATUS_LABELS: Record<SellStatus, string> = {
  SELLING: "판매중",
  DISCONTINUED: "단종",
  ON_HOLD: "보류",
}

export const ITEM_TYPE_ORDER: ItemType[] = [
  "RAW_MATERIAL", "SUB_MATERIAL", "FINISHED_PRODUCT", "SEMI_FINISHED", "MERCHANDISE",
]

export const STORAGE_METHOD_ORDER: StorageMethod[] = [
  "REFRIGERATED", "FROZEN", "ROOM_TEMPERATURE",
]

export type SalesChannelFilter = "store" | "coupang" | "kurly" | "etc"

export const SALES_CHANNEL_LABELS: Record<SalesChannelFilter, string> = {
  store: "자사몰", coupang: "쿠팡", kurly: "컬리", etc: "기타",
}

export const SALES_CHANNEL_ORDER: SalesChannelFilter[] = ["store", "coupang", "kurly", "etc"]

export type CodePrefixFilter = "ZIP" | "SAN" | "BAN" | "etc"

export const CODE_PREFIX_LABELS: Record<CodePrefixFilter, string> = {
  ZIP: "ZIP", SAN: "SAN", BAN: "BAN", etc: "기타",
}

export const CODE_PREFIX_ORDER: CodePrefixFilter[] = ["ZIP", "SAN", "BAN", "etc"]

export type ActiveStatusFilter = "ALL" | "Y" | "N"

export const ACTIVE_STATUS_LABELS: Record<ActiveStatusFilter, string> = {
  ALL: "전체", Y: "사용중", N: "사용중단",
}

export interface ItemFilterParams {
  search?: string
  codePrefix?: CodePrefixFilter[]
  type?: ItemType[]
  storageMethod?: StorageMethod[]
  stockControl?: YesNo[]
  salesChannel?: SalesChannelFilter[]
  activeStatus?: ActiveStatusFilter
}

export interface Item {
  code: string
  name: string
  category: string | null
  unit: ItemUnit | null
  weightPerUnit: string | null
  storageMethod: StorageMethod | null
  type: ItemType | null
  purchasePrice: number | null
  purchaseVat: number | null
  salePrice: number | null
  saleVat: number | null
  companyId: string | null
  moq: number | null
  stockControl: YesNo | null
  safetyStockQty: number | null
  leadTimeDays: number | null
  note: string | null
  productBarcode: string | null
  outerBoxBarcode: string | null
  unitsPerBox: number | null
  isSet: YesNo | null
  isActive: YesNo | null
  deactivationReason: string | null
}

export interface ItemProcessInfo {
  preprocessTotalWeight: number | null
  preprocessLossWeight: number | null
  coolingTotalWeight: number | null
  coolingLossWeight: number | null
  coolingTimeSeconds: number | null
  packagingTotalWeight: number | null
  packagingLossWeight: number | null
  laborTime: number | null
  expenseWeight: number | null
  standardMaterialCost: number | null
  standardLaborCost: number | null
  standardExpenseCost: number | null
  weightSorterNo2f: string | null
  weightSorterNo3f: string | null
}

export interface ItemQuality {
  reportNumber: string | null
  reportDate: string | null
  reportFileId: string | null
  foodType: string | null
  sterilizationType: string | null
  expirationPeriod: string | null
  labeling: string | null
  allergyLabeling: string | null
  labelingForProduct: string | null
  dominoFileId: string | null
  dominoImageId: string | null
  calorie: number | null
  storageInstruction: string | null
  isHaccp: boolean | null
  mainIngredient: string | null
  mainIngredientRate: number | null
  allergyIngredients: string | null
  manufacturer: string | null
  manufacturerAddress: string | null
  repacker: string | null
  repackerAddress: string | null
  supplier: string | null
  supplierAddress: string | null
  returnAddress: string | null
  customerServiceTel: string | null
  packagingMaterial: string | null
  commonLabeling: string | null
}

export interface SalesChannel {
  name: string | null
  code: string | null
  barcode: string | null
  quantity: number | null
  price: number | null
  sellStatus: SellStatus | null
  releasedAt: string | null
  discontinuedAt: string | null
  discontinuedReason: string | null
}

export interface ItemDetail extends Item {
  processInfo: ItemProcessInfo
  quality: ItemQuality
  salesChannels: {
    store: SalesChannel
    coupang: SalesChannel
    kurly: SalesChannel
  }
}
