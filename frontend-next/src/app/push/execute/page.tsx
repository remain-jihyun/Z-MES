"use client";
import { useState } from "react";
import { mockPushExecute } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Play } from "lucide-react";

type PushItem = typeof mockPushExecute[0];

export default function Page() {
  const [items, setItems] = useState(mockPushExecute);
  const [selected, setSelected] = useState<PushItem | null>(null);
  const [execQtyInput, setExecQtyInput] = useState("");

  const start = (id: string) => setItems(p => p.map(i => i.id === id ? { ...i, status: "완료" as const, execQty: i.planQty } : i));

  const saveExec = () => {
    if (!selected) return;
    setItems(p => p.map(i => i.id === selected.id ? { ...i, execQty: Number(execQtyInput), status: "완료" as const } : i));
    setSelected(null);
  };

  const openEdit = (item: PushItem) => {
    setSelected(item);
    setExecQtyInput(String(item.execQty));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">생산실행</h1>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["ID","실행일자","품목코드","제품명","계획수량","실행수량","담당자","상태",""].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{items.map(i=>(
            <tr key={i.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openEdit(i)}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{i.id}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{i.date}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{i.productCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{i.productName}</td>
              <td className="px-4 py-3 text-right">{i.planQty.toLocaleString()}</td>
              <td className="px-4 py-3 text-right font-medium">{i.execQty > 0 ? i.execQty.toLocaleString() : "—"}</td>
              <td className="px-4 py-3 text-xs text-gray-600">{i.assignee}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(i.status as string)==="완료"?"bg-green-100 text-green-700":(i.status as string)==="진행"?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-500"}`}>{i.status}</span>
              </td>
              <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                {i.status==="대기" && (
                  <Button variant="outline" size="sm" className="h-6 text-xs gap-1" onClick={() => start(i.id)}>
                    <Play className="w-3 h-3"/>시작
                  </Button>
                )}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>실행 수량 업데이트 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-gray-500">품목코드</span><div className="font-mono font-medium mt-0.5">{selected.productCode}</div></div>
                <div><span className="text-xs text-gray-500">제품명</span><div className="font-medium mt-0.5">{selected.productName}</div></div>
                <div><span className="text-xs text-gray-500">계획 수량</span><div className="mt-0.5">{selected.planQty.toLocaleString()}</div></div>
                <div><span className="text-xs text-gray-500">담당자</span><div className="mt-0.5">{selected.assignee}</div></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">실행 수량</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={execQtyInput}
                  onChange={e => setExecQtyInput(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>취소</Button>
            <Button onClick={saveExec}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
