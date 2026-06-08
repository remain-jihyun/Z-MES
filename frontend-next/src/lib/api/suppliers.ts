import { mockSuppliers } from "@/lib/mock-data"

export type OrderMethod = "이메일" | "카카오톡" | "문자" | "엑셀 다운로드"

export type Supplier = typeof mockSuppliers[0] & {
  orderMethod: OrderMethod
  orderEmail?: string
  useOrder: boolean
}

let store: Supplier[] = mockSuppliers.map((s, i) => ({
  ...s,
  orderMethod: (["이메일", "이메일", "엑셀 다운로드"] as OrderMethod[])[i] ?? "이메일",
  orderEmail: i === 0 ? "order@sikjajaejoo.co.kr" : undefined,
  useOrder: true,
}))

export function getSuppliers(): Supplier[] {
  return [...store]
}

export function createSupplier(data: Omit<Supplier, "code">): Supplier {
  const code = `S-${String(store.length + 1).padStart(3, "0")}`
  const created = { code, ...data }
  store = [...store, created]
  return created
}

export function updateSupplier(code: string, data: Supplier): void {
  store = store.map(s => s.code === code ? data : s)
}

export function deleteSupplier(code: string): void {
  store = store.filter(s => s.code !== code)
}
