"use client";

import { useState } from "react";
import { mockPurchaseOrders } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type PO = typeof mockPurchaseOrders[0];

export default function PurchasePage() {
  const [orders, setOrders] = useState(mockPurchaseOrders);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PO | null>(null);
  const [form, setForm] = useState({ supplier: "식자재㈜", material: "", qty: "", unit: "kg", unitPrice: "", dueDate: "" });

  const handleAdd = () => {
    if (!form.material || !form.qty || !form.unitPrice || !form.dueDate) return;
    const today = new Date().toISOString().slice(0, 10);
    const dateStr = today.replace(/-/g, "");
    const sameDayCount = orders.filter(o => o.date === today).length;
    setOrders(p => [{
      id: `PO-${dateStr}-${String(sameDayCount + 1).padStart(3, "0")}`,
      date: today,
      supplier: form.supplier,
      material: form.material,
      qty: Number(form.qty),
      unit: form.unit,
      unitPrice: Number(form.unitPrice),
      dueDate: form.dueDate,
      status: "대기" as const,
      approver: null,
    }, ...p]);
    setForm({ supplier: "식자재㈜", material: "", qty: "", unit: "kg", unitPrice: "", dueDate: "" });
    setOpen(false);
  };

  const approve = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "승인" as const, approver: "관리자" } : o));
    setSelected(null);
  };

  const reject = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">발주서</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4" />발주서 작성</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["발주번호", "발주일", "거래처", "자재", "수량", "단위", "단가", "납기일", "상태", "승인자"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(o)}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.id}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{o.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{o.supplier}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{o.material}</td>
                  <td className="px-4 py-3 text-right font-medium">{o.qty}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{o.unit}</td>
                  <td className="px-4 py-3 text-right text-sm">{o.unitPrice.toLocaleString()}원</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{o.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.status === "승인" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{o.approver ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 발주서 작성 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>발주서 작성</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">거래처</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.supplier} onChange={e => setForm(p => ({...p, supplier: e.target.value}))}>
                <option value="식자재㈜">식자재㈜</option>
                <option value="채소농원">채소농원</option>
                <option value="두부농원">두부농원</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">자재명</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭고기" value={form.material} onChange={e => setForm(p => ({...p, material: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">단위</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="kg" value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.qty} onChange={e => setForm(p => ({...p, qty: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">단가 (원)</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.unitPrice} onChange={e => setForm(p => ({...p, unitPrice: e.target.value}))}/>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs text-gray-600">납기일</label>
                <input type="date" className="w-full border rounded px-3 py-2 text-sm" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))}/>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>발주 등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 행 클릭 승인/반려 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>발주서 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">거래처</span><div className="font-medium mt-0.5">{selected.supplier}</div></div>
                <div><span className="text-xs text-gray-500">자재</span><div className="font-medium mt-0.5">{selected.material}</div></div>
                <div><span className="text-xs text-gray-500">수량</span><div className="mt-0.5">{selected.qty} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">단가</span><div className="mt-0.5">{selected.unitPrice.toLocaleString()}원</div></div>
                <div><span className="text-xs text-gray-500">발주일</span><div className="mt-0.5">{selected.date}</div></div>
                <div><span className="text-xs text-gray-500">납기일</span><div className="mt-0.5">{selected.dueDate}</div></div>
                <div><span className="text-xs text-gray-500">총액</span><div className="font-bold text-blue-700 mt-0.5">{(selected.qty * selected.unitPrice).toLocaleString()}원</div></div>
                <div><span className="text-xs text-gray-500">상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status === "승인" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{selected.status}</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>닫기</Button>
            {selected?.status === "대기" && (
              <>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => selected && reject(selected.id)}>삭제</Button>
                <Button onClick={() => selected && approve(selected.id)}>승인</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
