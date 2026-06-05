import { mockItemDetails } from "@/lib/mock-items"
import type { ItemDetail, ItemFilterParams } from "@/types/products"

let items = [...mockItemDetails]

const KNOWN_PREFIXES = ["ZIP", "SAN", "BAN"]

export interface GetItemsParams extends ItemFilterParams {
  page?: number
  pageSize?: number
  sortKey?: keyof ItemDetail
  sortDirection?: "asc" | "desc"
}

export interface PaginatedItems {
  data: ItemDetail[]
  total: number
}

export async function getItems(params: GetItemsParams = {}): Promise<PaginatedItems> {
  const {
    search, codePrefix, type, storageMethod, stockControl, salesChannel,
    activeStatus, page = 1, pageSize = 20, sortKey, sortDirection,
  } = params

  let filtered = items.filter((item) => {
    if (activeStatus && activeStatus !== "ALL") {
      if (item.isActive !== activeStatus) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!item.code.toLowerCase().includes(q) && !item.name.toLowerCase().includes(q)) return false
    }
    if (codePrefix && codePrefix.length > 0) {
      const code = item.code.toUpperCase()
      const match = codePrefix.some((p) => {
        if (p === "etc") return !KNOWN_PREFIXES.some((kp) => code.startsWith(kp))
        return code.startsWith(p)
      })
      if (!match) return false
    }
    if (type && type.length > 0 && (item.type == null || !type.includes(item.type))) return false
    if (storageMethod && storageMethod.length > 0 && (item.storageMethod == null || !storageMethod.includes(item.storageMethod))) return false
    if (stockControl && stockControl.length > 0 && (item.stockControl == null || !stockControl.includes(item.stockControl))) return false
    if (salesChannel && salesChannel.length > 0) {
      const hasStore = item.salesChannels.store.name != null || item.salesChannels.store.sellStatus != null
      const hasCoupang = item.salesChannels.coupang.name != null || item.salesChannels.coupang.sellStatus != null
      const hasKurly = item.salesChannels.kurly.name != null || item.salesChannels.kurly.sellStatus != null
      const hasNone = !hasStore && !hasCoupang && !hasKurly
      const match = salesChannel.some((ch) => {
        if (ch === "store") return hasStore
        if (ch === "coupang") return hasCoupang
        if (ch === "kurly") return hasKurly
        return hasNone
      })
      if (!match) return false
    }
    return true
  })

  if (sortKey && sortDirection) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal)
      const bStr = String(bVal)
      return sortDirection === "asc"
        ? aStr.localeCompare(bStr, "ko")
        : bStr.localeCompare(aStr, "ko")
    })
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  return { data: filtered.slice(start, start + pageSize), total }
}

export async function getItemByCode(code: string): Promise<ItemDetail | null> {
  return items.find((item) => item.code === code) ?? null
}

export async function createItem(item: ItemDetail): Promise<ItemDetail> {
  items = [item, ...items]
  return item
}

export async function updateItem(code: string, data: ItemDetail): Promise<ItemDetail> {
  const idx = items.findIndex((item) => item.code === code)
  if (idx === -1) throw new Error("품목을 찾을 수 없습니다.")
  items[idx] = data
  return items[idx]
}

export async function deactivateItem(code: string, reason: string): Promise<ItemDetail> {
  const idx = items.findIndex((item) => item.code === code)
  if (idx === -1) throw new Error("품목을 찾을 수 없습니다.")
  items[idx] = { ...items[idx], isActive: "N", deactivationReason: reason }
  return items[idx]
}

export async function reactivateItem(code: string): Promise<ItemDetail> {
  const idx = items.findIndex((item) => item.code === code)
  if (idx === -1) throw new Error("품목을 찾을 수 없습니다.")
  items[idx] = { ...items[idx], isActive: "Y", deactivationReason: null }
  return items[idx]
}

export async function deleteItem(code: string): Promise<void> {
  items = items.filter((item) => item.code !== code)
}
