"use client";
import { useState } from "react";
import { mockDeviation } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type Deviation = typeof mockDeviation[0];

export default function Page() {
  const [records, setRecords] = useState(mockDeviation);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Deviation | null>(null);
  const [form, setForm] = useState({ type: "미출", productCode: "", productName: "", stdQty: "", actualQty: "", reason: "" });

  const handleAdd = () => {
    if (!form.productCode || !form.productName || !form.stdQty || !form.actualQty) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const diff = Number(form.actualQty) - Number(form.stdQty);
    setRecords(p => [{
      id: `DV-${String(p.length + 1).padStart(3, "0")}`,
      datetime: now,
      assignee: "관리자",
      diffQty: diff,
      type: form.type,
      productCode: form.productCode,
      productName: form.productName,
      stdQty: Number(form.stdQty),
      actualQty: Number(form.actualQty),
      reason: form.reason,
    }, ...p]);
    setForm({ type: "미출", productCode: "", productName: "", stdQty: "", actualQty: "", reason: "" });
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">미출/과생산</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4"/>등록</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["ID","발생일시","유형","품목코드","제품명","기준수량","실제수량","차이수량","사유","담당자"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{records.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(r)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.id}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.datetime}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type==="미출"?"bg-red-100 text-red-700":"bg-orange-100 text-orange-700"}`}>{r.type}</span></td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.productCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.productName}</td>
              <td className="px-4 py-3 text-right">{r.stdQty}</td>
              <td className="px-4 py-3 text-right font-medium">{r.actualQty}</td>
              <td className={`px-4 py-3 text-right font-medium ${r.diffQty < 0?"text-red-600":"text-green-600"}`}>{r.diffQty > 0?"+":""}{r.diffQty}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.reason}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.assignee}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 등록 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>미출/과생산 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">유형</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                <option value="미출">미출</option>
                <option value="과생산">과생산</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">품목코드</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="P-001" value={form.productCode} onChange={e => setForm(p => ({...p, productCode: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">제품명</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭갈비" value={form.productName} onChange={e => setForm(p => ({...p, productName: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">기준 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.stdQty} onChange={e => setForm(p => ({...p, stdQty: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">실제 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.actualQty} onChange={e => setForm(p => ({...p, actualQty: e.target.value}))}/>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">사유</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="포장 불량 등" value={form.reason} onChange={e => setForm(p => ({...p, reason: e.target.value}))}/>
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
          <DialogHeader><DialogTitle>미출/과생산 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">발생일시</span><div className="mt-0.5">{selected.datetime}</div></div>
                <div><span className="text-xs text-gray-500">유형</span><div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.type==="미출"?"bg-red-100 text-red-700":"bg-orange-100 text-orange-700"}`}>{selected.type}</span></div></div>
                <div><span className="text-xs text-gray-500">품목코드</span><div className="font-mono font-medium mt-0.5">{selected.productCode}</div></div>
                <div><span className="text-xs text-gray-500">제품명</span><div className="font-medium mt-0.5">{selected.productName}</div></div>
                <div><span className="text-xs text-gray-500">기준 수량</span><div className="mt-0.5">{selected.stdQty}</div></div>
                <div><span className="text-xs text-gray-500">실제 수량</span><div className="font-medium mt-0.5">{selected.actualQty}</div></div>
                <div><span className="text-xs text-gray-500">차이</span><div className={`font-bold mt-0.5 ${selected.diffQty < 0?"text-red-600":"text-green-600"}`}>{selected.diffQty > 0 ? "+" : ""}{selected.diffQty}</div></div>
                <div><span className="text-xs text-gray-500">담당자</span><div className="mt-0.5">{selected.assignee}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">사유</span><div className="mt-0.5">{selected.reason}</div></div>
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
