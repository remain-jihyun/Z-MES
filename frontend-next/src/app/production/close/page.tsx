"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockKanbans } from "@/lib/mock-data";
import { CheckCircle, AlertCircle } from "lucide-react";

type KanbanStatus = "대기" | "진행" | "완료";
type LocalKanban = Omit<typeof mockKanbans[0], "status" | "startTime" | "endTime"> & {
  status: KanbanStatus; startTime: string | null; endTime: string | null;
};

export default function ClosePage() {
  const [kanbans, setKanbans] = useState<LocalKanban[]>(mockKanbans as LocalKanban[]);
  const [closed, setClosed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({
    date: "2026-06-02",
    assignee: "관리자",
    cleaning: "완료",
    gas: "",
    electric: "",
    water: "",
  });

  const incompletedKanbans = kanbans.filter((k) => k.status !== "완료");
  const canClose = incompletedKanbans.length === 0;

  const completeAll = () =>
    setKanbans(prev => prev.map(k => ({ ...k, status: "완료" as const, progress: 100 })));

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canClose) return;
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setClosed(true);
  };

  if (closed) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96 gap-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">일일 마감 완료</h2>
        <p className="text-gray-500">2026-06-02 생산 데이터가 마감 처리되었습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
          <span className="text-gray-400">생산계획 PULL</span>
          <span>›</span>
          <span className="text-blue-600 font-medium">5단계: 완료(일일마감)</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">완료 (일일마감)</h1>
      </div>

      {!canClose && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-medium text-red-700">미완료 간반이 있습니다.</div>
            <div className="text-xs text-red-500 mt-1">
              {incompletedKanbans.map((k) => `${k.id}(${k.status})`).join(", ")}
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs shrink-0" onClick={completeAll}>
            전체 완료 처리
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">마감 정보 입력</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">마감일자</Label>
              <Input type="date" value={form.date} onChange={e => handleChange("date", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">담당자</Label>
              <Input value={form.assignee} onChange={e => handleChange("assignee", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">청소 상태</Label>
              <select
                value={form.cleaning}
                onChange={e => handleChange("cleaning", e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="완료">청소 완료</option>
                <option value="미완료">청소 미완료</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">가스 검침 (m³)</Label>
              <Input type="number" placeholder="0" value={form.gas} onChange={e => handleChange("gas", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">전기 검침 (kWh)</Label>
              <Input type="number" placeholder="0" value={form.electric} onChange={e => handleChange("electric", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">수도 검침 (m³)</Label>
              <Input type="number" placeholder="0" value={form.water} onChange={e => handleChange("water", e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">현장 사진</Label>
              <Input type="file" accept="image/*" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={!canClose} className="gap-2">
            <CheckCircle className="w-4 h-4" />
            일일 마감
          </Button>
        </div>
      </form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일일 마감 확인</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2 text-sm text-gray-700">
            <p>마감일자: <strong>{form.date}</strong></p>
            <p>담당자: <strong>{form.assignee}</strong></p>
            <p>청소 상태: <strong>{form.cleaning}</strong></p>
            <p className="text-gray-500 text-xs mt-3">마감 후에는 수정이 불가합니다. 진행하시겠습니까?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>취소</Button>
            <Button onClick={handleConfirm}>마감 확정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
