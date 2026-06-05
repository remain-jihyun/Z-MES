"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockKanbans } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Nfc } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Status = "대기" | "진행" | "완료";
type Kanban = Omit<typeof mockKanbans[0], "status" | "endTime"> & { status: Status; endTime: string | null };

export default function ExecutePage() {
  const router = useRouter();
  const [scan, setScan] = useState("");
  const [kanbans, setKanbans] = useState<Kanban[]>(mockKanbans);
  const [selected, setSelected] = useState<Kanban | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const match = kanbans.find((k) => k.id === scan.trim());
    if (match) {
      setKanbans((prev) =>
        prev.map((k) => {
          if (k.id !== match.id) return k;
          const nextStatus = k.status === "대기" ? "진행" : k.status === "진행" ? "완료" : k.status;
          return { ...k, status: nextStatus, progress: k.status === "진행" ? 100 : k.progress } as Kanban;
        })
      );
      setScan("");
    }
  };

  const handleComplete = () => {
    if (!selected) return;
    setKanbans(prev => prev.map(k =>
      k.id === selected.id ? { ...k, status: "완료" as const, progress: 100 } : k
    ));
    setSelected(null);
  };

  const advanceStatus = () => {
    if (!selected) return;
    const next = selected.status === "대기" ? "진행" as const : selected.status === "진행" ? "완료" as const : "완료" as const;
    setKanbans(prev => prev.map(k =>
      k.id === selected.id ? { ...k, status: next, progress: next === "완료" ? 100 : next === "진행" ? 50 : 0 } : k
    ));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="text-gray-400">생산계획 PULL</span>
            <span>›</span>
            <span className="text-blue-600 font-medium">4단계: 생산</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">생산</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/production/kanban")}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 간반
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => router.push("/production/close")}>
            완료(마감)
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* NFC 스캔 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Nfc className="w-5 h-5 text-blue-500" />
            <form onSubmit={handleScan} className="flex gap-2 flex-1">
              <Input
                value={scan}
                onChange={(e) => setScan(e.target.value)}
                placeholder="NFC 스캔 또는 간반번호 입력 (예: A-20260602-001)"
                className="bg-white"
              />
              <Button type="submit" size="sm">입력</Button>
            </form>
            <span className="text-xs text-blue-500">A-20260602-001 ~ D-20260602-002 테스트 가능</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["간반번호", "반", "제품명", "담당자", "시작시간", "종료시간", "상태", "진행률"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {kanbans.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(k)}>
                  <td className="px-4 py-3 font-mono text-xs font-medium">{k.id}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{k.team}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{k.product}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{k.assignee}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{k.startTime ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{k.endTime ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      k.status === "완료" ? "bg-green-100 text-green-700" :
                      k.status === "진행" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{k.status}</span>
                  </td>
                  <td className="px-4 py-3 w-28">
                    <div className="flex items-center gap-2">
                      <Progress value={k.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-gray-400 w-7">{k.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>생산 현황 — {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-gray-500">제품명</span><div className="font-medium mt-0.5">{selected.product}</div></div>
                <div><span className="text-xs text-gray-500">수량</span><div className="font-medium mt-0.5">{selected.qty} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">담당자</span><div className="mt-0.5">{selected.assignee}</div></div>
                <div><span className="text-xs text-gray-500">현재 상태</span>
                  <div className="mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      selected.status === "완료" ? "bg-green-100 text-green-700" :
                      selected.status === "진행" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>{selected.status}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">진행률</div>
                <div className="flex items-center gap-2">
                  <Progress value={selected.progress} className="h-2 flex-1" />
                  <span className="text-sm font-medium text-gray-700 w-10">{selected.progress}%</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>닫기</Button>
            {selected?.status !== "완료" && (
              <>
                <Button variant="outline" onClick={advanceStatus}>
                  {selected?.status === "대기" ? "→ 진행" : "→ 완료"}
                </Button>
                {selected?.status === "진행" && (
                  <Button onClick={handleComplete}>완료 처리</Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
