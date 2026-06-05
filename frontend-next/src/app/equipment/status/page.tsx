"use client";
import { useState } from "react";
import { mockEquipments } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChangeLogBanner } from "@/components/ChangeLogBanner";

// ── 타입 ──────────────────────────────────────────────────

type HeatUnit = "kcal/h" | "W";
type Status   = "정상" | "점검중" | "고장";

type Equipment = {
  code: string;
  name: string;
  location: string;
  installedAt: string;
  maker: string;
  model: string;
  status: Status;
  heatPerHour: number;
  heatUnit: HeatUnit;
  moisturePerHour: number;
};

// ── 상수 ──────────────────────────────────────────────────

const STATUS_STYLE: Record<Status, string> = {
  정상:  "bg-green-100 text-green-700",
  점검중: "bg-yellow-100 text-yellow-700",
  고장:  "bg-red-100 text-red-700",
};

const HEAT_UNITS: HeatUnit[] = ["kcal/h", "W"];

const EMPTY_FORM = {
  code: "", name: "", location: "", maker: "", model: "",
  heatPerHour: "", heatUnit: "kcal/h" as HeatUnit,
  moisturePerHour: "",
};

// ── 헬퍼 ──────────────────────────────────────────────────

function fmtHeat(val: number, unit: HeatUnit) {
  return `${val.toLocaleString()} ${unit}`;
}

function fmtMoisture(val: number) {
  return `${val} kg/h`;
}

// ── 단위 토글 버튼 ─────────────────────────────────────────

function HeatUnitToggle({ value, onChange }: { value: HeatUnit; onChange: (u: HeatUnit) => void }) {
  return (
    <div className="flex rounded-md border overflow-hidden text-xs font-medium">
      {HEAT_UNITS.map(u => (
        <button key={u} type="button"
          className={cn("px-2.5 py-1 transition-colors",
            value === u ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted")}
          onClick={() => onChange(u)}>
          {u}
        </button>
      ))}
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────

export default function Page() {
  const [equips, setEquips] = useState<Equipment[]>(
    mockEquipments.map(e => ({ ...e, heatUnit: (e.heatUnit ?? "kcal/h") as HeatUnit }))
  );
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [editStatus, setEditStatus] = useState<Status>("정상");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // ── 편집 저장 ──
  const saveEdit = () => {
    if (!selected) return;
    setEquips(prev => prev.map(e => e.code === selected.code ? { ...selected, status: editStatus } : e));
    setSelected(null);
  };

  // ── 등록 ──
  const handleAdd = () => {
    if (!form.code || !form.name) return;
    setEquips(prev => [...prev, {
      code: form.code, name: form.name, location: form.location,
      maker: form.maker, model: form.model,
      installedAt: new Date().toISOString().slice(0, 10),
      status: "정상",
      heatPerHour: form.heatPerHour ? Number(form.heatPerHour) : 0,
      heatUnit: form.heatUnit,
      moisturePerHour: form.moisturePerHour ? Number(form.moisturePerHour) : 0,
    }]);
    setForm(EMPTY_FORM);
    setAddOpen(false);
  };

  return (
    <div className="space-y-0">
      <ChangeLogBanner pageHref="/equipment/status" />
      <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">설비현황</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" />설비 등록
        </Button>
      </div>

      {/* ── 목록 테이블 ── */}
      <Card><CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b bg-gray-50">
              {["설비코드", "설비명", "설치위치", "설치일", "제조사", "모델명", "열발생량/h", "수분발생량/h", "운영상태"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {equips.map(e => (
              <tr key={e.code} className="hover:bg-gray-50 cursor-pointer"
                onClick={() => { setSelected({ ...e }); setEditStatus(e.status); }}>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.code}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{e.name}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{e.location}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{e.installedAt}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{e.maker}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{e.model}</td>
                <td className="px-4 py-3 text-xs text-right text-gray-700">
                  {e.heatPerHour != null ? fmtHeat(e.heatPerHour, e.heatUnit ?? "kcal/h") : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-right text-gray-700">
                  {e.moisturePerHour != null ? fmtMoisture(e.moisturePerHour) : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[e.status]}`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent></Card>

      {/* ── 상세/편집 다이얼로그 ── */}
      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader><DialogTitle>설비 상세 — {selected?.code}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500">설비코드</span>
                  <div className="font-mono font-medium mt-0.5">{selected.code}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">설비명</span>
                  <input className="w-full border rounded px-2 py-1 text-sm mt-0.5"
                    value={selected.name}
                    onChange={e => setSelected(p => p ? { ...p, name: e.target.value } : p)} />
                </div>
                <div>
                  <span className="text-xs text-gray-500">설치위치</span>
                  <input className="w-full border rounded px-2 py-1 text-sm mt-0.5"
                    value={selected.location}
                    onChange={e => setSelected(p => p ? { ...p, location: e.target.value } : p)} />
                </div>
                <div>
                  <span className="text-xs text-gray-500">설치일</span>
                  <div className="mt-0.5 text-sm">{selected.installedAt}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">제조사</span>
                  <div className="mt-0.5 text-sm">{selected.maker}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">모델</span>
                  <div className="mt-0.5 text-sm">{selected.model}</div>
                </div>
              </div>

              {/* 열·수분 발생량 */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                {/* 열발생량 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600 font-medium">시간당 열발생량</label>
                    <HeatUnitToggle
                      value={selected.heatUnit ?? "kcal/h"}
                      onChange={u => setSelected(p => p ? { ...p, heatUnit: u } : p)} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input type="number" step="0.1" min="0"
                      className="flex-1 border rounded px-3 py-2 text-sm"
                      value={selected.heatPerHour ?? ""}
                      onChange={e => setSelected(p => p ? { ...p, heatPerHour: Number(e.target.value) } : p)} />
                    <span className="text-xs text-gray-500 shrink-0">{selected.heatUnit ?? "kcal/h"}</span>
                  </div>
                </div>

                {/* 수분발생량 */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-600 font-medium block">시간당 수분발생량</label>
                  <div className="flex items-center gap-1.5">
                    <input type="number" step="0.1" min="0"
                      className="flex-1 border rounded px-3 py-2 text-sm"
                      value={selected.moisturePerHour ?? ""}
                      onChange={e => setSelected(p => p ? { ...p, moisturePerHour: Number(e.target.value) } : p)} />
                    <span className="text-xs text-gray-500 shrink-0">kg/h</span>
                  </div>
                </div>
              </div>

              {/* 상태 변경 */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600 font-medium">운영상태 변경</label>
                <div className="flex gap-2">
                  {(["정상", "점검중", "고장"] as Status[]).map(s => (
                    <button key={s} onClick={() => setEditStatus(s)}
                      className={cn("flex-1 py-2 rounded text-xs font-medium border transition-colors",
                        editStatus === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-gray-600 border-gray-200 hover:bg-gray-50")}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>취소</Button>
            <Button onClick={saveEdit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 설비 등록 다이얼로그 ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader><DialogTitle>설비 등록</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">설비코드 *</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="EQ-006"
                value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">설비명 *</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="진공포장기"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">설치위치</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="포장실"
                value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">제조사</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="대양기계"
                value={form.maker} onChange={e => setForm(p => ({ ...p, maker: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">모델명</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="DY-VP100"
                value={form.model} onChange={e => setForm(p => ({ ...p, model: e.target.value }))} />
            </div>

            {/* 열발생량 — 단위 토글 포함 */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-600">열발생량/h</label>
                <HeatUnitToggle value={form.heatUnit} onChange={u => setForm(p => ({ ...p, heatUnit: u }))} />
              </div>
              <div className="flex items-center gap-1.5">
                <input type="number" step="0.1" min="0"
                  className="flex-1 border rounded px-3 py-2 text-sm" placeholder="0.0"
                  value={form.heatPerHour} onChange={e => setForm(p => ({ ...p, heatPerHour: e.target.value }))} />
                <span className="text-xs text-gray-500 shrink-0">{form.heatUnit}</span>
              </div>
            </div>

            {/* 수분발생량 */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">수분발생량/h</label>
              <div className="flex items-center gap-1.5">
                <input type="number" step="0.1" min="0"
                  className="flex-1 border rounded px-3 py-2 text-sm" placeholder="0.0"
                  value={form.moisturePerHour} onChange={e => setForm(p => ({ ...p, moisturePerHour: e.target.value }))} />
                <span className="text-xs text-gray-500 shrink-0">kg/h</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>취소</Button>
            <Button onClick={handleAdd} disabled={!form.code || !form.name}>등록</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
