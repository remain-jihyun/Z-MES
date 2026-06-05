"use client";
import { useState } from "react";
import { mockRepairHistory } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type RepairRecord = { id: string; equipCode: string; equipName: string; occurDate: string; problem: string; repair: string; part: string | null; partCode: string | null; repairer: string; cost: number };

export default function Page() {
  const [records, setRecords] = useState<RepairRecord[]>(mockRepairHistory as RepairRecord[]);
  const [selected, setSelected] = useState<RepairRecord | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ equipCode: "", equipName: "", problem: "", repair: "", part: "", partCode: "", repairer: "", cost: "" });

  const handleAdd = () => {
    if (!form.equipCode || !form.problem) return;
    const today = new Date().toISOString().slice(0, 10);
    setRecords(p => [{
      id: `RP-${String(p.length + 1).padStart(3, "0")}`,
      equipCode: form.equipCode,
      equipName: form.equipName,
      occurDate: today,
      problem: form.problem,
      repair: form.repair,
      part: form.part || null,
      partCode: form.partCode || null,
      repairer: form.repairer,
      cost: Number(form.cost) || 0,
    }, ...p]);
    setForm({ equipCode: "", equipName: "", problem: "", repair: "", part: "", partCode: "", repairer: "", cost: "" });
    setAddOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">수리/부품 이력</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>이력 등록</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["ID","설비코드","설비명","발생일","문제내용","수리내용","교체부품","부품코드","수리자","비용"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{records.map(r=>(
            <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(r)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.id}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.equipCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.equipName}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{r.occurDate}</td>
              <td className="px-4 py-3 text-xs text-gray-700">{r.problem}</td>
              <td className="px-4 py-3 text-xs text-gray-700">{r.repair}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.part ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.partCode ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{r.repairer}</td>
              <td className="px-4 py-3 text-right text-sm font-medium">{r.cost ? r.cost.toLocaleString()+"원" : "—"}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 상세 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>수리 이력 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">설비코드</span><div className="font-mono font-medium mt-0.5">{selected.equipCode}</div></div>
                <div><span className="text-xs text-gray-500">설비명</span><div className="font-medium mt-0.5">{selected.equipName}</div></div>
                <div><span className="text-xs text-gray-500">발생일</span><div className="mt-0.5">{selected.occurDate}</div></div>
                <div><span className="text-xs text-gray-500">수리자</span><div className="mt-0.5">{selected.repairer}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">문제 내용</span><div className="mt-0.5">{selected.problem}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">수리 내용</span><div className="mt-0.5">{selected.repair}</div></div>
                <div><span className="text-xs text-gray-500">교체 부품</span><div className="mt-0.5">{selected.part ?? "—"}</div></div>
                <div><span className="text-xs text-gray-500">부품 코드</span><div className="font-mono mt-0.5">{selected.partCode ?? "—"}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">수리 비용</span><div className="font-bold text-blue-700 mt-0.5">{selected.cost ? selected.cost.toLocaleString() + "원" : "—"}</div></div>
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
          <DialogHeader><DialogTitle>수리 이력 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-600">설비코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="EQ-001" value={form.equipCode} onChange={e => setForm(p => ({...p, equipCode: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">설비명</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="진공포장기" value={form.equipName} onChange={e => setForm(p => ({...p, equipName: e.target.value}))}/></div>
            </div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">문제 내용</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="모터 과열 정지" value={form.problem} onChange={e => setForm(p => ({...p, problem: e.target.value}))}/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">수리 내용</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="팬 교체" value={form.repair} onChange={e => setForm(p => ({...p, repair: e.target.value}))}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-600">교체 부품</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="냉각팬 (선택)" value={form.part} onChange={e => setForm(p => ({...p, part: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">부품 코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="선택" value={form.partCode} onChange={e => setForm(p => ({...p, partCode: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">수리자</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="외주업체A" value={form.repairer} onChange={e => setForm(p => ({...p, repairer: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">비용 (원)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.cost} onChange={e => setForm(p => ({...p, cost: e.target.value}))}/></div>
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
