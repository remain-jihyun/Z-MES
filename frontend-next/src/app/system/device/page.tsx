"use client";

import { useState } from "react";
import { mockDevices } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

type Device = { id: string; type: string; assignee: string | null; location: string; registeredAt: string; status: "활성" | "비활성" };

export default function DevicePage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices as Device[]);
  const [selected, setSelected] = useState<Device | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ id: "", type: "공용 간반 출력용", assignee: "", location: "" });

  const handleAdd = () => {
    if (!form.id) return;
    const today = new Date().toISOString().slice(0, 10);
    setDevices(p => [...p, {
      id: form.id,
      type: form.type,
      assignee: form.assignee || null,
      location: form.location,
      registeredAt: today,
      status: "활성" as const,
    }]);
    setForm({ id: "", type: "공용 간반 출력용", assignee: "", location: "" });
    setAddOpen(false);
  };

  const toggleStatus = () => {
    if (!selected) return;
    setDevices(p => p.map(d => d.id === selected.id
      ? { ...d, status: d.status === "활성" ? "비활성" as const : "활성" as const }
      : d
    ));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">디바이스 등록</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" />디바이스 등록</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["디바이스 ID", "유형", "배정 작업자", "위치", "등록일", "상태"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(d)}>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-800">{d.id}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{d.assignee ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.location}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{d.registeredAt}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.status === "활성" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 상세/편집 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>디바이스 상세 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">ID</span><div className="font-mono font-medium mt-0.5">{selected.id}</div></div>
                <div><span className="text-xs text-gray-500">유형</span><div className="mt-0.5">{selected.type}</div></div>
                <div><span className="text-xs text-gray-500">배정 작업자</span><div className="mt-0.5">{selected.assignee ?? "—"}</div></div>
                <div><span className="text-xs text-gray-500">위치</span><div className="mt-0.5">{selected.location}</div></div>
                <div><span className="text-xs text-gray-500">등록일</span><div className="mt-0.5">{selected.registeredAt}</div></div>
                <div><span className="text-xs text-gray-500">상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status === "활성" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{selected.status}</span></div>
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

      {/* 등록 Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>디바이스 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5"><label className="text-xs text-gray-600">디바이스 ID</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="DEV-006" value={form.id} onChange={e => setForm(p => ({...p, id: e.target.value}))}/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">유형</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>
                <option value="공용 간반 출력용">공용 간반 출력용</option>
                <option value="반장 개별 지급용">반장 개별 지급용</option>
                <option value="사무직용">사무직용</option>
              </select>
            </div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">배정 작업자 (선택)</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="김철수" value={form.assignee} onChange={e => setForm(p => ({...p, assignee: e.target.value}))}/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">위치</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="1반 작업장" value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))}/></div>
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
