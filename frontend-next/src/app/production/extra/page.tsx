"use client";
import { useState } from "react";
import { mockExtraProduction } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type Record = typeof mockExtraProduction[0];

export default function Page() {
  const [records, setRecords] = useState(mockExtraProduction);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record | null>(null);
  const [form, setForm] = useState({ productCode: "", productName: "", addQty: "", unit: "팩", method: "수정", reason: "" });

  const handleAdd = () => {
    if (!form.productCode || !form.productName || !form.addQty || !form.reason) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setRecords(p => [{
      id: `EP-${String(p.length + 1).padStart(3, "0")}`,
      datetime: now,
      status: "대기" as const,
      productCode: form.productCode,
      productName: form.productName,
      addQty: Number(form.addQty),
      unit: form.unit,
      method: form.method,
      reason: form.reason,
    }, ...p]);
    setForm({ productCode: "", productName: "", addQty: "", unit: "팩", method: "수정", reason: "" });
    setOpen(false);
  };

  const approve = () => {
    if (!selected) return;
    setRecords(p => p.map(r => r.id === selected.id ? { ...r, status: "승인" as const } : r));
    setSelected(null);
  };

  const reject = () => {
    if (!selected) return;
    setRecords(p => p.filter(r => r.id !== selected.id));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">추가생산</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4"/>추가생산 요청</Button>
      </div>

      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["ID","요청일시","품목코드","제품명","추가수량","단위","처리방식","사유","상태"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{records.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(r)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.id}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.datetime}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.productCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.productName}</td>
              <td className="px-4 py-3 text-right font-medium">{r.addQty}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{r.unit}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${r.method==="교체"?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700"}`}>{r.method}</span></td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.reason}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status==="승인"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{r.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 등록 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>추가생산 요청</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
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
                <label className="text-xs text-gray-600">추가 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.addQty} onChange={e => setForm(p => ({...p, addQty: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">단위</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="팩" value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))}/>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">처리 방식</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.method} onChange={e => setForm(p => ({...p, method: e.target.value}))}>
                <option value="수정">수정 (출력 전)</option>
                <option value="교체">교체 (출력 후)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">사유</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="추가 주문 발생 등" value={form.reason} onChange={e => setForm(p => ({...p, reason: e.target.value}))}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>요청</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 행 클릭 — 승인/반려 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>추가생산 요청 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">품목코드</span><div className="font-mono font-medium mt-0.5">{selected.productCode}</div></div>
                <div><span className="text-xs text-gray-500">제품명</span><div className="font-medium mt-0.5">{selected.productName}</div></div>
                <div><span className="text-xs text-gray-500">추가 수량</span><div className="font-medium mt-0.5">{selected.addQty} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">처리 방식</span><div className="mt-0.5">{selected.method}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">사유</span><div className="mt-0.5">{selected.reason}</div></div>
                <div><span className="text-xs text-gray-500">현재 상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status==="승인"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{selected.status}</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>닫기</Button>
            {selected?.status === "대기" && (
              <>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={reject}>반려</Button>
                <Button onClick={approve}>승인</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
