"use client";
import { useState } from "react";
import { mockInspection } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, Play } from "lucide-react";

export default function Page() {
  const [items, setItems] = useState(mockInspection);
  const [started, setStarted] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const updateSecond = (code: string, val: string) =>
    setItems(p => p.map(i => i.materialCode === code ? { ...i, secondQty: Number(val), diff: Number(val) - i.bookQty } : i));

  const handleClose = () => {
    setConfirmed(true);
    setConfirmOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">재고실사</h1>
          <p className="text-sm text-gray-500 mt-0.5">2026-06-02 데일리 실사 · 1차: 반장 / 2차: 관리자</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setStarted(true)} disabled={started}>
            <Play className="w-4 h-4"/>
            {started ? "실사 진행 중" : "실사 시작"}
          </Button>
          <Button size="sm" className="gap-1.5" disabled={!started || confirmed} onClick={() => setConfirmOpen(true)}>
            <CheckCircle className="w-4 h-4"/>
            {confirmed ? "월말 마감 완료" : "월말 마감 확정"}
          </Button>
        </div>
      </div>

      {started && !confirmed && (
        <div className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
          실사가 시작되었습니다. 2차 실사 수량을 입력하세요.
        </div>
      )}
      {confirmed && (
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
          월말 마감이 확정되었습니다.
        </div>
      )}

      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["자재코드","자재명","위치","장부수량","1차 실사","2차 실사","편차","실사자","날짜"].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{items.map(i=>(
            <tr key={i.materialCode} className={`hover:bg-gray-50 ${i.diff && Math.abs(i.diff)>2?"bg-yellow-50/40":""}`}>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{i.materialCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{i.materialName}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{i.location}</td>
              <td className="px-4 py-3 text-right font-medium">{i.bookQty}</td>
              <td className="px-4 py-3 text-right text-blue-600 font-medium">{i.firstQty}</td>
              <td className="px-4 py-3">
                {i.secondQty !== null
                  ? <span className="text-right block font-medium text-green-600">{i.secondQty}</span>
                  : started
                    ? <Input type="number" className="w-20 h-7 text-sm text-right" placeholder="—" onChange={e => updateSecond(i.materialCode, e.target.value)}/>
                    : <span className="text-gray-400 text-xs">—</span>
                }
              </td>
              <td className={`px-4 py-3 text-right font-medium ${!i.diff?"text-gray-400":i.diff<0?"text-red-600":"text-orange-600"}`}>
                {i.diff===null?"—":i.diff===0?"0":`${i.diff>0?"+":""}${i.diff}`}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">{i.inspector}</td>
              <td className="px-4 py-3 text-xs text-gray-500">{i.date}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>월말 마감 확정</DialogTitle></DialogHeader>
          <div className="py-2 text-sm text-gray-700 space-y-2">
            <p>실사 결과를 확정하고 월말 마감을 진행합니다.</p>
            <p className="text-xs text-gray-500">마감 후에는 수량 수정이 불가합니다. 진행하시겠습니까?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>취소</Button>
            <Button onClick={handleClose}>확정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
