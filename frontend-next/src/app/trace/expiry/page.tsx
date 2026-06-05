"use client";
import { useState } from "react";
import { mockExpiry } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const statusStyle = { 정상: "bg-green-100 text-green-700", 임박: "bg-yellow-100 text-yellow-700", 초과: "bg-red-100 text-red-700" } as const;
type Expiry = typeof mockExpiry[0];

export default function Page() {
  const [items] = useState(mockExpiry);
  const [selected, setSelected] = useState<Expiry | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">소비기한 관리</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>등록</Button>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["자재코드","자재명","기준일수(D-)","현재 소비기한","알림 기준일","상태"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{items.map(e=>(
            <tr key={e.materialCode} className={`hover:bg-gray-50 cursor-pointer ${e.status==="초과"?"bg-red-50/40":e.status==="임박"?"bg-yellow-50/40":""}`} onClick={() => setSelected(e)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.materialCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{e.materialName}</td>
              <td className="px-4 py-3 text-center text-sm font-medium">D-{e.criterionDays}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{e.currentExpiry}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{e.alertDate}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[e.status]}`}>{e.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      {/* 상세 Dialog */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>소비기한 상세 — {selected?.materialName}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">자재코드</span><div className="font-mono font-medium mt-0.5">{selected.materialCode}</div></div>
                <div><span className="text-xs text-gray-500">자재명</span><div className="font-medium mt-0.5">{selected.materialName}</div></div>
                <div><span className="text-xs text-gray-500">기준일수</span><div className="mt-0.5">D-{selected.criterionDays}</div></div>
                <div><span className="text-xs text-gray-500">상태</span>
                  <div className="mt-0.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[selected.status]}`}>{selected.status}</span></div>
                </div>
                <div><span className="text-xs text-gray-500">현재 소비기한</span><div className="font-medium mt-0.5">{selected.currentExpiry}</div></div>
                <div><span className="text-xs text-gray-500">알림 기준일</span><div className="mt-0.5">{selected.alertDate}</div></div>
              </div>
              {selected.status !== "정상" && (
                <div className={`rounded p-3 text-xs ${selected.status === "초과" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                  {selected.status === "초과" ? "소비기한이 이미 지났습니다. 즉시 폐기 처리를 검토하세요." : "소비기한이 임박합니다. 조속히 사용 또는 추가 발주를 검토하세요."}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 등록 Dialog (placeholder) */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>소비기한 등록</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5"><label className="text-xs text-gray-600">자재코드</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="RM-001"/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">자재명</label><input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭고기"/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">기준일수 (D-)</label><input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="3"/></div>
            <div className="space-y-1.5"><label className="text-xs text-gray-600">소비기한</label><input type="date" className="w-full border rounded px-3 py-2 text-sm"/></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>취소</Button>
            <Button onClick={() => setAddOpen(false)}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
