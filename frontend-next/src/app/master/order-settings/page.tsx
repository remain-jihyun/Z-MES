"use client";
import { useState } from "react";
import { mockOrderSettings } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Save } from "lucide-react";

type Setting = typeof mockOrderSettings[0];

export default function Page() {
  const [settings, setSettings] = useState(mockOrderSettings);
  const [selected, setSelected] = useState<Setting | null>(null);
  const [editForm, setEditForm] = useState<Setting | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openEdit = (s: Setting) => {
    setSelected(s);
    setEditForm({ ...s });
  };

  const saveEdit = () => {
    if (!editForm) return;
    setSettings(p => p.map(s => s.materialCode === editForm.materialCode ? editForm : s));
    setSelected(null);
    setEditForm(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">발주 설정</h1>
        <Button size="sm" className="gap-1.5" onClick={handleSave}><Save className="w-4 h-4"/>{saved ? "저장 완료!" : "저장"}</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["자재코드","자재명","발주간격(일)","조달기간(일)","안전계수(Z)","서비스수준(%)","최소발주량"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{settings.map((s,i)=>(
            <tr key={s.materialCode} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(s)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.materialCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{s.materialName}</td>
              <td className="px-4 py-3 text-center text-sm">{s.interval}</td>
              <td className="px-4 py-3 text-center text-sm">{s.leadTime}</td>
              <td className="px-4 py-3 text-center text-sm">{s.zValue}</td>
              <td className="px-4 py-3 text-center text-sm">{s.serviceLevel}</td>
              <td className="px-4 py-3 text-center text-sm">{s.minOrder}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>
      <p className="text-xs text-gray-400">행을 클릭하면 설정을 수정할 수 있습니다.</p>

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>발주 설정 수정 — {selected?.materialName}</DialogTitle></DialogHeader>
          {editForm && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-gray-500">자재코드</span><div className="font-mono font-medium mt-0.5">{editForm.materialCode}</div></div>
                <div><span className="text-xs text-gray-500">자재명</span><div className="font-medium mt-0.5">{editForm.materialName}</div></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-xs text-gray-600">발주간격 (일)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" value={editForm.interval} onChange={e => setEditForm(p => p ? {...p, interval: Number(e.target.value)} : p)}/></div>
                <div className="space-y-1.5"><label className="text-xs text-gray-600">조달기간 (일)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" value={editForm.leadTime} onChange={e => setEditForm(p => p ? {...p, leadTime: Number(e.target.value)} : p)}/></div>
                <div className="space-y-1.5"><label className="text-xs text-gray-600">안전계수 (Z)</label><input type="number" step="0.01" className="w-full border rounded px-3 py-2 text-sm" value={editForm.zValue} onChange={e => setEditForm(p => p ? {...p, zValue: Number(e.target.value)} : p)}/></div>
                <div className="space-y-1.5"><label className="text-xs text-gray-600">서비스수준 (%)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" value={editForm.serviceLevel} onChange={e => setEditForm(p => p ? {...p, serviceLevel: Number(e.target.value)} : p)}/></div>
                <div className="col-span-2 space-y-1.5"><label className="text-xs text-gray-600">최소발주량</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" value={editForm.minOrder} onChange={e => setEditForm(p => p ? {...p, minOrder: Number(e.target.value)} : p)}/></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>취소</Button>
            <Button onClick={saveEdit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
