"use client";
import { useState } from "react";
import { mockDomino } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Wifi, WifiOff, Link } from "lucide-react";

type DominoItem = typeof mockDomino[0];

export default function Page() {
  const [items, setItems] = useState(mockDomino);
  const [selected, setSelected] = useState<DominoItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ deviceCode: "", product: "", productName: "", format: "소비기한+제품명+중량" });

  const handleAdd = () => {
    if (!form.deviceCode || !form.product) return;
    setItems(p => [...p, { ...form, status: "연결" as const }]);
    setForm({ deviceCode: "", product: "", productName: "", format: "소비기한+제품명+중량" });
    setAddOpen(false);
  };

  const toggleConnect = () => {
    if (!selected) return;
    setItems(p => p.map(d => d.deviceCode === selected.deviceCode
      ? { ...d, status: d.status === "연결" ? "오류" as const : "연결" as const }
      : d
    ));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">도미노 TTO</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => selected && toggleConnect()}>
            <Link className="w-4 h-4"/>연결 설정
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>디바이스 등록</Button>
        </div>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["디바이스코드","연동 품목코드","품목명","출력 포맷","연결 상태"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{items.map(d=>(
            <tr key={d.deviceCode} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(d)}>
              <td className="px-4 py-3 font-mono text-xs font-medium text-gray-800">{d.deviceCode}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.product}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{d.productName}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{d.format}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit ${d.status==="연결"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>
                  {d.status==="연결" ? <Wifi className="w-3 h-3"/> : <WifiOff className="w-3 h-3"/>}{d.status}
                </span>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 상세 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>도미노 TTO 상세 — {selected?.deviceCode}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">디바이스코드</span><div className="font-mono font-medium mt-0.5">{selected.deviceCode}</div></div>
                <div><span className="text-xs text-gray-500">연동 품목코드</span><div className="font-mono mt-0.5">{selected.product}</div></div>
                <div><span className="text-xs text-gray-500">품목명</span><div className="font-medium mt-0.5">{selected.productName}</div></div>
                <div><span className="text-xs text-gray-500">연결 상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected.status==="연결"?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{selected.status}</span></div>
                </div>
                <div className="col-span-2"><span className="text-xs text-gray-500">출력 포맷</span><div className="mt-0.5">{selected.format}</div></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>닫기</Button>
            <Button onClick={toggleConnect}>
              {selected?.status === "연결" ? "연결 해제" : "재연결"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 등록 Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>도미노 디바이스 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="text-xs text-gray-600">디바이스코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="DM-004" value={form.deviceCode} onChange={e => setForm(p => ({...p, deviceCode: e.target.value}))}/></div>
              <div className="space-y-1.5"><label className="text-xs text-gray-600">연동 품목코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="P-001" value={form.product} onChange={e => setForm(p => ({...p, product: e.target.value}))}/></div>
            </div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">품목명</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭갈비" value={form.productName} onChange={e => setForm(p => ({...p, productName: e.target.value}))}/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">출력 포맷</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={form.format} onChange={e => setForm(p => ({...p, format: e.target.value}))}>
                <option value="소비기한+제품명+중량">소비기한+제품명+중량</option>
                <option value="소비기한+제품명">소비기한+제품명</option>
              </select>
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
