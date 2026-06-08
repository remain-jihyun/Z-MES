"use client";
import { useState } from "react";
import {
  getSuppliers, createSupplier, updateSupplier,
  type Supplier, type OrderMethod,
} from "@/lib/api/suppliers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Info } from "lucide-react";

const ORDER_METHODS: OrderMethod[] = ["이메일", "카카오톡", "문자", "엑셀 다운로드"]
const methodStyle: Record<OrderMethod, string> = {
  "이메일": "bg-blue-100 text-blue-700",
  "카카오톡": "bg-yellow-100 text-yellow-700",
  "문자": "bg-green-100 text-green-700",
  "엑셀 다운로드": "bg-purple-100 text-purple-700",
}

type FormState = Omit<Supplier, "code">

export default function Page() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getSuppliers())
  const [selected, setSelected] = useState<Supplier | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: "", contact: "", phone: "", orderMethod: "이메일", orderEmail: "", useOrder: true,
  })
  const reload = () => setSuppliers(getSuppliers())

  const handleAdd = () => {
    if (!form.name) return
    createSupplier(form)
    reload()
    setForm({ name: "", contact: "", phone: "", orderMethod: "이메일", orderEmail: "", useOrder: true })
    setAddOpen(false)
  }

  const handleSave = () => {
    if (!selected) return
    updateSupplier(selected.code, selected)
    reload()
    setSelected(null)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">거래처</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" />거래처 등록
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>거래처 정보는 <strong>Z-MIS</strong>에서 입력 및 수정합니다. Z-MIS 내 발주 사용 여부가 체크된 거래처만 MES로 연동됩니다.</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["거래처코드", "거래처명", "담당자", "연락처", "발주 방식", "발주 연동"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.map(s => (
                <tr key={s.code} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected({ ...s })}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.contact}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${methodStyle[s.orderMethod]}`}>
                      {s.orderMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.useOrder ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      {s.useOrder ? "연동" : "미사용"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400">총 {suppliers.length}건</div>

      {/* 거래처 등록 */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader><DialogTitle>거래처 등록</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs text-gray-600">거래처명 *</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="신선식품㈜" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">담당자</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="홍길동" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">연락처</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="02-0000-0000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs text-gray-600">발주 방식</label>
              <div className="flex gap-2 flex-wrap">
                {ORDER_METHODS.map(m => (
                  <button key={m} type="button" onClick={() => setForm(p => ({ ...p, orderMethod: m }))}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${form.orderMethod === m ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {form.orderMethod === "이메일" && (
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs text-gray-600">발주 이메일</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="order@company.com" value={form.orderEmail ?? ""} onChange={e => setForm(p => ({ ...p, orderEmail: e.target.value }))} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(false)}>취소</Button>
            <Button size="sm" onClick={handleAdd} disabled={!form.name}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 거래처 상세/편집 */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader><DialogTitle>거래처 상세 — {selected?.code}</DialogTitle></DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">거래처코드</label>
                <div className="h-9 flex items-center px-3 rounded-md border bg-muted/50 text-sm font-mono">{selected.code}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">거래처명</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={selected.name} onChange={e => setSelected(p => p ? { ...p, name: e.target.value } : p)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">담당자</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={selected.contact} onChange={e => setSelected(p => p ? { ...p, contact: e.target.value } : p)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">연락처</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={selected.phone} onChange={e => setSelected(p => p ? { ...p, phone: e.target.value } : p)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs text-gray-600">발주 방식</label>
                <div className="flex gap-2 flex-wrap">
                  {ORDER_METHODS.map(m => (
                    <button key={m} type="button" onClick={() => setSelected(p => p ? { ...p, orderMethod: m } : p)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${selected.orderMethod === m ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {selected.orderMethod === "이메일" && (
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs text-gray-600">발주 이메일</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={selected.orderEmail ?? ""} onChange={e => setSelected(p => p ? { ...p, orderEmail: e.target.value } : p)} />
                </div>
              )}
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs text-gray-600">발주 연동 여부</label>
                <div className="flex gap-2">
                  {[true, false].map(v => (
                    <button key={String(v)} type="button" onClick={() => setSelected(p => p ? { ...p, useOrder: v } : p)}
                      className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${selected.useOrder === v ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}>
                      {v ? "연동" : "미사용"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelected(null)}>취소</Button>
            <Button size="sm" onClick={handleSave}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
