"use client";
import { useState } from "react";
import { mockExtraMaterial } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Page() {
  const [records, setRecords] = useState(mockExtraMaterial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ kanbanId: "", materialCode: "", materialName: "", stdQty: "", addQty: "", unit: "g", requester: "" });

  const handleAdd = () => {
    if (!form.kanbanId || !form.materialCode || !form.materialName || !form.addQty) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setRecords(p => [{
      id: `EM-${String(p.length + 1).padStart(3, "0")}`,
      datetime: now,
      kanbanId: form.kanbanId,
      materialCode: form.materialCode,
      materialName: form.materialName,
      stdQty: Number(form.stdQty),
      addQty: Number(form.addQty),
      unit: form.unit,
      requester: form.requester,
    }, ...p]);
    setForm({ kanbanId: "", materialCode: "", materialName: "", stdQty: "", addQty: "", unit: "g", requester: "" });
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">추가불출</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4"/>불출 요청</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["ID","요청일시","간반번호","자재코드","자재명","기준수량","추가수량","단위","요청자"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{records.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.id}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.datetime}</td>
              <td className="px-4 py-3 font-mono text-xs font-medium">{r.kanbanId}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.materialCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.materialName}</td>
              <td className="px-4 py-3 text-right">{r.stdQty}</td>
              <td className="px-4 py-3 text-right font-medium text-blue-600">{r.addQty}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{r.unit}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.requester}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>추가불출 요청</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">간반번호</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="A-20260602-001" value={form.kanbanId} onChange={e => setForm(p => ({...p, kanbanId: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">자재코드</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="RM-001" value={form.materialCode} onChange={e => setForm(p => ({...p, materialCode: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">자재명</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭고기" value={form.materialName} onChange={e => setForm(p => ({...p, materialName: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">단위</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="g" value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">기준 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.stdQty} onChange={e => setForm(p => ({...p, stdQty: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">추가 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.addQty} onChange={e => setForm(p => ({...p, addQty: e.target.value}))}/>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">요청자</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="이름" value={form.requester} onChange={e => setForm(p => ({...p, requester: e.target.value}))}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>요청</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
