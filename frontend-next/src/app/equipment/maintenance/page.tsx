"use client";
import { useState } from "react";
import { mockMaintenance } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, AlertTriangle } from "lucide-react";

type Maintenance = typeof mockMaintenance[0];

export default function Page() {
  const [items, setItems] = useState(mockMaintenance);
  const [selected, setSelected] = useState<Maintenance | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ code: "", equipName: "", cycle: "", inspector: "", result: "" });

  const handleAdd = () => {
    if (!form.code || !form.equipName) return;
    const today = new Date().toISOString().slice(0, 10);
    setItems(p => [...p, {
      code: form.code,
      equipName: form.equipName,
      cycle: Number(form.cycle) || 30,
      lastCheck: today,
      nextCheck: new Date(Date.now() + (Number(form.cycle) || 30) * 86400000).toISOString().slice(0, 10),
      inspector: form.inspector,
      result: form.result,
      status: "정상" as const,
    }]);
    setForm({ code: "", equipName: "", cycle: "", inspector: "", result: "" });
    setAddOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">보전관리</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>점검 등록</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["설비코드","설비명","점검주기","마지막 점검","다음 점검","점검자","결과","상태"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{items.map(m=>(
            <tr key={m.code} className={`hover:bg-gray-50 cursor-pointer ${m.status==="지연"?"bg-yellow-50/40":""}`} onClick={() => setSelected(m)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{m.code}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{m.equipName}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{m.cycle}일</td>
              <td className="px-4 py-3 text-xs text-gray-500">{m.lastCheck}</td>
              <td className={`px-4 py-3 text-xs font-medium ${m.status==="지연"?"text-red-600":"text-gray-600"}`}>{m.nextCheck}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{m.inspector}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{m.result}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${m.status==="지연"?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>
                  {m.status==="지연" && <AlertTriangle className="w-3 h-3"/>}{m.status}
                </span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 상세 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>점검 상세 — {selected?.equipName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">설비코드</span><div className="font-mono font-medium mt-0.5">{selected.code}</div></div>
                <div><span className="text-xs text-gray-500">설비명</span><div className="font-medium mt-0.5">{selected.equipName}</div></div>
                <div><span className="text-xs text-gray-500">점검주기</span><div className="mt-0.5">{selected.cycle}일</div></div>
                <div><span className="text-xs text-gray-500">점검자</span><div className="mt-0.5">{selected.inspector}</div></div>
                <div><span className="text-xs text-gray-500">마지막 점검</span><div className="mt-0.5">{selected.lastCheck}</div></div>
                <div><span className="text-xs text-gray-500">다음 점검</span><div className={`font-medium mt-0.5 ${selected.status==="지연"?"text-red-600":""}`}>{selected.nextCheck}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">결과</span><div className="mt-0.5">{selected.result}</div></div>
                <div><span className="text-xs text-gray-500">상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status==="지연"?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>{selected.status}</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 등록 Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>점검 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-600">설비코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="EQ-001" value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">설비명</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="진공포장기" value={form.equipName} onChange={e => setForm(p => ({...p, equipName: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">점검주기(일)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="30" value={form.cycle} onChange={e => setForm(p => ({...p, cycle: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">점검자</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="김철수" value={form.inspector} onChange={e => setForm(p => ({...p, inspector: e.target.value}))}/></div>
            </div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">점검 결과</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="이상없음" value={form.result} onChange={e => setForm(p => ({...p, result: e.target.value}))}/></div>
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
