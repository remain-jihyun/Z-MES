"use client";

import { useState } from "react";
import { mockWasteRecords } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type WasteRecord = typeof mockWasteRecords[0];

export default function WastePage() {
  const [records, setRecords] = useState(mockWasteRecords);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WasteRecord | null>(null);
  const [form, setForm] = useState({ type: "전처리", code: "", name: "", qty: "", unit: "kg", reason: "" });

  const handleAdd = () => {
    if (!form.code || !form.name || !form.qty || !form.reason) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setRecords(prev => [{
      id: `W-${String(prev.length + 1).padStart(3, "0")}`,
      datetime: now,
      assignee: "관리자",
      type: form.type,
      code: form.code,
      name: form.name,
      qty: Number(form.qty),
      unit: form.unit,
      reason: form.reason,
    }, ...prev]);
    setForm({ type: "전처리", code: "", name: "", qty: "", unit: "kg", reason: "" });
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">폐기</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4" />폐기 등록</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["ID", "폐기일시", "유형", "코드", "명칭", "수량", "단위", "사유", "담당자"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.id}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.datetime}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{r.type}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-right font-medium">{r.qty}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.unit}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.reason}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 등록 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>폐기 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">폐기 유형</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                <option value="전처리">전처리</option>
                <option value="조리">조리</option>
                <option value="원재료">원재료</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">제품·자재코드</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="RM-001" value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">명칭</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭고기" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">폐기 수량</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.qty} onChange={e => setForm(p => ({...p, qty: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">단위</label>
                <input className="w-full border rounded px-3 py-2 text-sm" placeholder="kg" value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))}/>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">폐기 사유</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="변색, 부패 등" value={form.reason} onChange={e => setForm(p => ({...p, reason: e.target.value}))}/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">사진</label>
              <input type="file" accept="image/*" className="w-full border rounded px-3 py-2 text-sm"/>
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
          <DialogHeader><DialogTitle>폐기 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">폐기일시</span><div className="mt-0.5">{selected.datetime}</div></div>
                <div><span className="text-xs text-gray-500">유형</span><div className="mt-0.5"><span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{selected.type}</span></div></div>
                <div><span className="text-xs text-gray-500">코드</span><div className="font-mono font-medium mt-0.5">{selected.code}</div></div>
                <div><span className="text-xs text-gray-500">명칭</span><div className="font-medium mt-0.5">{selected.name}</div></div>
                <div><span className="text-xs text-gray-500">수량</span><div className="font-medium mt-0.5">{selected.qty} {selected.unit}</div></div>
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
