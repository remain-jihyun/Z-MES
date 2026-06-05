"use client";
import { useState } from "react";
import { mockNfcTags } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Nfc } from "lucide-react";

type NfcTag = typeof mockNfcTags[0];

export default function Page() {
  const [tags, setTags] = useState(mockNfcTags);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NfcTag | null>(null);
  const [form, setForm] = useState({ id: "", target: "설비", targetRef: "", task: "" });

  const handleAdd = () => {
    if (!form.id || !form.targetRef || !form.task) return;
    const today = new Date().toISOString().slice(0, 10);
    setTags(p => [...p, { ...form, registeredAt: today, status: "활성" as const }]);
    setForm({ id: "", target: "설비", targetRef: "", task: "" });
    setOpen(false);
  };

  const toggleStatus = () => {
    if (!selected) return;
    setTags(p => p.map(t => t.id === selected.id
      ? { ...t, status: t.status === "활성" ? "비활성" as const : "활성" as const }
      : t
    ));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">NFC 태그</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}><Plus className="w-4 h-4"/>태그 등록</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["태그 ID","연결 대상","대상 참조","연결 작업","등록일","상태"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{tags.map(t=>(
            <tr key={t.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(t)}>
              <td className="px-4 py-3 font-mono text-xs font-medium text-gray-800">
                <span className="flex items-center gap-1.5"><Nfc className="w-3.5 h-3.5 text-gray-400"/>{t.id}</span>
              </td>
              <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{t.target}</span></td>
              <td className="px-4 py-3 text-xs text-gray-700">{t.targetRef}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{t.task}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{t.registeredAt}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.status==="활성"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-400"}`}>{t.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 등록 Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>NFC 태그 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5"><label className="text-xs text-gray-600">태그 ID</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="NFC-005" value={form.id} onChange={e => setForm(p => ({...p, id: e.target.value}))}/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">연결 대상</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.target} onChange={e => setForm(p => ({...p, target: e.target.value}))}>
                <option value="설비">설비</option>
                <option value="위치">위치</option>
                <option value="품목">품목</option>
              </select>
            </div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">대상 참조 (코드/이름)</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="EQ-001 또는 냉장창고 A" value={form.targetRef} onChange={e => setForm(p => ({...p, targetRef: e.target.value}))}/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">연결 작업</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="시작/완료 스캔" value={form.task} onChange={e => setForm(p => ({...p, task: e.target.value}))}/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 상세/편집 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>NFC 태그 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">태그 ID</span><div className="font-mono font-medium mt-0.5">{selected.id}</div></div>
                <div><span className="text-xs text-gray-500">연결 대상</span><div className="mt-0.5"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{selected.target}</span></div></div>
                <div><span className="text-xs text-gray-500">대상 참조</span><div className="mt-0.5">{selected.targetRef}</div></div>
                <div><span className="text-xs text-gray-500">등록일</span><div className="mt-0.5">{selected.registeredAt}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">연결 작업</span><div className="mt-0.5">{selected.task}</div></div>
                <div><span className="text-xs text-gray-500">상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status==="활성"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-400"}`}>{selected.status}</span></div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>닫기</Button>
            <Button
              variant={selected?.status === "활성" ? "outline" : "default"}
              className={selected?.status === "활성" ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
              onClick={toggleStatus}
            >
              {selected?.status === "활성" ? "비활성화" : "활성화"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
