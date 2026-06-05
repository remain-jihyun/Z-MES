"use client";
import { useState } from "react";
import { mockYield } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";

type YieldItem = typeof mockYield[0];

export default function Page() {
  const [items, setItems] = useState(mockYield);
  const [saved, setSaved] = useState(false);
  const [selected, setSelected] = useState<YieldItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editYield, setEditYield] = useState("");
  const [form, setForm] = useState({ code: "", name: "", process: "전처리", yieldRate: "", stdWeight: "", lossWeight: "", appliedDate: "" });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveEdit = () => {
    if (!selected) return;
    setItems(p => p.map(i => (i.code === selected.code && i.process === selected.process) ? { ...i, yieldRate: Number(editYield) } : i));
    setSelected(null);
  };

  const handleAdd = () => {
    if (!form.code || !form.name || !form.yieldRate) return;
    setItems(p => [...p, {
      code: form.code,
      name: form.name,
      process: form.process,
      yieldRate: Number(form.yieldRate),
      stdWeight: Number(form.stdWeight),
      lossWeight: Number(form.lossWeight),
      appliedDate: form.appliedDate || new Date().toISOString().slice(0, 10),
    }]);
    setForm({ code: "", name: "", process: "전처리", yieldRate: "", stdWeight: "", lossWeight: "", appliedDate: "" });
    setAddOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">수율</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>수율 등록</Button>
          <Button size="sm" className="gap-1.5" onClick={handleSave}><Save className="w-4 h-4"/>{saved ? "저장 완료!" : "저장"}</Button>
        </div>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["품목코드","품목명","공정유형","수율(%)","기준중량(g)","손실중량(g)","적용일"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{items.map((y,i)=>(
            <tr key={i} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelected(y); setEditYield(String(y.yieldRate)); }}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{y.code}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{y.name}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${y.process==="전처리"?"bg-orange-100 text-orange-700":y.process==="냉각"?"bg-blue-100 text-blue-700":"bg-green-100 text-green-700"}`}>{y.process}</span></td>
              <td className="px-4 py-3 text-right font-medium">{y.yieldRate}%</td>
              <td className="px-4 py-3 text-right font-medium">{y.stdWeight}</td>
              <td className="px-4 py-3 text-right text-red-500">{y.lossWeight}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{y.appliedDate}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 편집 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>수율 수정 — {selected?.name} ({selected?.process})</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-gray-500">품목코드</span><div className="font-mono font-medium mt-0.5">{selected.code}</div></div>
                <div><span className="text-xs text-gray-500">공정유형</span><div className="mt-0.5">{selected.process}</div></div>
                <div><span className="text-xs text-gray-500">기준중량</span><div className="mt-0.5">{selected.stdWeight}g</div></div>
                <div><span className="text-xs text-gray-500">손실중량</span><div className="mt-0.5">{selected.lossWeight}g</div></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">수율 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={editYield}
                  onChange={e => setEditYield(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>취소</Button>
            <Button onClick={saveEdit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 등록 Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>수율 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-600">품목코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="P-001" value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">품목명</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭갈비" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">공정유형</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.process} onChange={e => setForm(p => ({...p, process: e.target.value}))}>
                  <option value="전처리">전처리</option>
                  <option value="냉각">냉각</option>
                  <option value="포장">포장</option>
                </select>
              </div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">수율 (%)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="85" value={form.yieldRate} onChange={e => setForm(p => ({...p, yieldRate: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">기준중량 (g)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="200" value={form.stdWeight} onChange={e => setForm(p => ({...p, stdWeight: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">손실중량 (g)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="30" value={form.lossWeight} onChange={e => setForm(p => ({...p, lossWeight: e.target.value}))}/></div>
              <div className="col-span-2 space-y-1.5"><label className="text-xs text-gray-600">적용일</label><input type="date" className="w-full border rounded px-3 py-2 text-sm" value={form.appliedDate} onChange={e => setForm(p => ({...p, appliedDate: e.target.value}))}/></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
