"use client";

import { useState } from "react";
import { mockKanbans } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const statusStyle = {
  완료: { badge: "bg-green-100 text-green-700 border-green-200", border: "border-green-300" },
  진행: { badge: "bg-blue-100 text-blue-700 border-blue-200", border: "border-blue-400" },
  대기: { badge: "bg-gray-100 text-gray-500 border-gray-200", border: "border-gray-200" },
};

const teams = ["1반", "2반", "3반", "4반"];
type Status = "대기" | "진행" | "완료";
type KanbanItem = Omit<typeof mockKanbans[0], "status"> & { status: Status };

export default function FieldPage() {
  const [kanbans, setKanbans] = useState<KanbanItem[]>(mockKanbans as KanbanItem[]);
  const [selected, setSelected] = useState<KanbanItem | null>(null);
  const [newStatus, setNewStatus] = useState<Status>("대기");

  const saveStatus = () => {
    if (!selected) return;
    setKanbans(prev => prev.map(k => {
      if (k.id !== selected.id) return k;
      const progress = newStatus === "완료" ? 100 : newStatus === "진행" ? 50 : 0;
      return { ...k, status: newStatus as Status, progress };
    }));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">현장관제</h1>
          <p className="text-sm text-gray-500 mt-0.5">현장 모니터 5개소 · 실시간 갱신</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-500">연결됨 · 최종 업데이트 14:23</span>
        </div>
      </div>

      {teams.map((team) => {
        const teamKanbans = kanbans.filter((k) => k.team === team);
        return (
          <Card key={team} className="overflow-hidden">
            <CardHeader className="py-3 px-4 bg-gray-50 border-b">
              <CardTitle className="text-sm font-semibold text-gray-700">{team}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {teamKanbans.map((k) => {
                  const style = statusStyle[k.status as keyof typeof statusStyle] ?? statusStyle["대기"];
                  return (
                    <div key={k.id} className={`flex items-center gap-4 px-4 py-3 border-l-4 ${style.border} cursor-pointer hover:bg-gray-50`} onClick={() => { setSelected(k); setNewStatus(k.status as Status); }}>
                      <div className="w-24">
                        <div className="text-sm font-medium text-gray-900">{k.id}</div>
                        <div className="text-xs text-gray-500">{k.process}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-800">{k.product}</div>
                        <div className="text-xs text-gray-500">{k.qty} {k.unit}</div>
                      </div>
                      <div className="w-20 text-xs text-gray-500">
                        <div>시작 {k.startTime ?? "—"}</div>
                        <div>종료 {k.endTime ?? "—"}</div>
                      </div>
                      <div className="w-20 text-xs text-gray-500">{k.assignee}</div>
                      <div className="w-28">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.badge}`}>
                            {k.status}
                          </span>
                          <span className="text-xs text-gray-500">{k.progress}%</span>
                        </div>
                        <Progress value={k.progress} className="h-1.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>상태 변경 — {selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-gray-500">제품</span><div className="font-medium mt-0.5">{selected.product}</div></div>
                <div><span className="text-xs text-gray-500">수량</span><div className="font-medium mt-0.5">{selected.qty} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">공정</span><div className="mt-0.5">{selected.process}</div></div>
                <div><span className="text-xs text-gray-500">담당자</span><div className="mt-0.5">{selected.assignee}</div></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">상태 변경</label>
                <div className="flex gap-2">
                  {(["대기", "진행", "완료"] as Status[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setNewStatus(s)}
                      className={`flex-1 py-2 rounded text-xs font-medium border ${newStatus === s ? "bg-blue-600 text-white border-blue-600" : "text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>취소</Button>
            <Button onClick={saveStatus}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
