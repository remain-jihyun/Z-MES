"use client";
import { useState } from "react";
import { mockForecastFeedback } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";

type FeedbackItem = typeof mockForecastFeedback[0];

export default function Page() {
  const [items, setItems] = useState(mockForecastFeedback);
  const [selected, setSelected] = useState<FeedbackItem | null>(null);

  const markDone = (id: string) => {
    setItems(p => p.map(i => i.id === id ? { ...i, isUrgent: false } : i));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">예측 피드백</h1>
      <div className="space-y-3">
        {items.map(i=>(
          <Card key={i.id} className={`cursor-pointer hover:shadow-sm transition-shadow ${i.isUrgent?"border-red-300 bg-red-50/50":""}`} onClick={() => setSelected(i)}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {i.isUrgent ? <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0"/> : <CheckCircle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0"/>}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{i.materialName}</span>
                      <span className="font-mono text-xs text-gray-500">{i.materialCode}</span>
                      {i.isUrgent && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">긴급발주</span>}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">부족 수량: <span className="font-semibold text-red-600">{i.shortage} {i.unit}</span></div>
                    <div className="text-xs text-gray-500 mt-1">{i.feedback}</div>
                    <div className="text-xs text-gray-400 mt-1">{i.datetime}</div>
                  </div>
                </div>
                {i.isUrgent && (
                  <Button size="sm" variant="outline" className="shrink-0" onClick={e => { e.stopPropagation(); markDone(i.id); }}>
                    처리 완료
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>피드백 상세</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-xs text-gray-500">자재코드</span><div className="font-mono font-medium mt-0.5">{selected.materialCode}</div></div>
                <div><span className="text-xs text-gray-500">자재명</span><div className="font-medium mt-0.5">{selected.materialName}</div></div>
                <div><span className="text-xs text-gray-500">부족 수량</span><div className="font-bold text-red-600 mt-0.5">{selected.shortage} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">긴급 여부</span><div className="mt-0.5">{selected.isUrgent ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">긴급</span> : <span className="text-xs text-gray-400">일반</span>}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">피드백 내용</span><div className="mt-0.5">{selected.feedback}</div></div>
                <div className="col-span-2"><span className="text-xs text-gray-500">발생일시</span><div className="mt-0.5">{selected.datetime}</div></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>닫기</Button>
            {selected?.isUrgent && <Button onClick={() => selected && markDone(selected.id)}>처리 완료</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
