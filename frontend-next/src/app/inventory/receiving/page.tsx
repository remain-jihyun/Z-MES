"use client";
import { useState } from "react";
import { mockReceiving } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, ScanLine } from "lucide-react";

type Receiving = typeof mockReceiving[0];

export default function Page() {
  const [records, setRecords] = useState(mockReceiving);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Receiving | null>(null);
  const [form, setForm] = useState({ materialCode: "", materialName: "", qty: "", unit: "kg", expiry: "", supplier: "식자재㈜", barcode: "" });

  const handleAdd = () => {
    if (!form.materialCode || !form.materialName || !form.qty) return;
    const today = new Date().toISOString().slice(0, 10);
    setRecords(p => [{
      id: `RC-${String(p.length + 1).padStart(3, "0")}`,
      date: today,
      inspector: "관리자",
      materialCode: form.materialCode,
      materialName: form.materialName,
      qty: Number(form.qty),
      unit: form.unit,
      expiry: form.expiry,
      supplier: form.supplier,
      barcode: form.barcode,
    }, ...p]);
    setForm({ materialCode: "", materialName: "", qty: "", unit: "kg", expiry: "", supplier: "식자재㈜", barcode: "" });
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">입고</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4"/>입고 등록</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["ID","입고일","자재코드","자재명","수량","단위","소비기한","거래처","검수자"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{records.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(r)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.id}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.date}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.materialCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.materialName}</td>
              <td className="px-4 py-3 text-right font-medium">{r.qty}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{r.unit}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.expiry}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.supplier}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{r.inspector}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 등록 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>입고 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">바코드 스캔</label>
              <div className="flex gap-2">
                <input className="flex-1 border rounded px-3 py-2 text-sm" placeholder="바코드 스캔 또는 직접 입력"/>
                <Button type="button" variant="outline" size="sm"><ScanLine className="w-4 h-4"/></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">자재코드</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="RM-001" value={form.materialCode} onChange={e => setForm(p => ({...p, materialCode: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">자재명</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭고기" value={form.materialName} onChange={e => setForm(p => ({...p, materialName: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">입고 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.qty} onChange={e => setForm(p => ({...p, qty: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">단위</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="kg" value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">소비기한</label>
                <input type="date" className="w-full border rounded px-3 py-2 text-sm" value={form.expiry} onChange={e => setForm(p => ({...p, expiry: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">거래처</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.supplier} onChange={e => setForm(p => ({...p, supplier: e.target.value}))}>
                  <option value="식자재㈜">식자재㈜</option>
                  <option value="채소농원">채소농원</option>
                  <option value="두부농원">두부농원</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">바코드</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="바코드 값 (선택)" value={form.barcode} onChange={e => setForm(p => ({...p, barcode: e.target.value}))}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 행 클릭 상세 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>입고 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">자재코드</span><div className="font-mono font-medium mt-0.5">{selected.materialCode}</div></div>
                <div><span className="text-xs text-gray-500">자재명</span><div className="font-medium mt-0.5">{selected.materialName}</div></div>
                <div><span className="text-xs text-gray-500">입고일</span><div className="mt-0.5">{selected.date}</div></div>
                <div><span className="text-xs text-gray-500">거래처</span><div className="mt-0.5">{selected.supplier}</div></div>
                <div><span className="text-xs text-gray-500">수량</span><div className="font-medium mt-0.5">{selected.qty} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">소비기한</span><div className="mt-0.5">{selected.expiry}</div></div>
                <div><span className="text-xs text-gray-500">검수자</span><div className="mt-0.5">{selected.inspector}</div></div>
                <div><span className="text-xs text-gray-500">바코드</span><div className="font-mono text-xs mt-0.5">{selected.barcode || "—"}</div></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
