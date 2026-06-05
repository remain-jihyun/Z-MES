"use client";
import { useState } from "react";
import { mockHaccpEquipments } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, ThermometerIcon, Plus } from "lucide-react";

type HaccpEquip = typeof mockHaccpEquipments[0];

export default function Page() {
  const [equips, setEquips] = useState(mockHaccpEquipments);
  const [addOpen, setAddOpen] = useState(false);
  const [targetCode, setTargetCode] = useState("");
  const [form, setForm] = useState({ ccpValue: "", humidity: "" });

  const handleAddRecord = () => {
    if (!targetCode || !form.ccpValue) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    setEquips(p => p.map(e => {
      if (e.code !== targetCode) return e;
      const val = Number(form.ccpValue);
      const isAlert = val > e.ccpMax || val < e.ccpMin;
      return {
        ...e,
        ccpValue: val,
        humidity: form.humidity ? Number(form.humidity) : e.humidity,
        checkDate: now.slice(0, 10),
        alertHistory: isAlert ? [...e.alertHistory, { time: now, value: val }] : e.alertHistory,
      };
    }));
    setForm({ ccpValue: "", humidity: "" });
    setAddOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">HACCP 설비</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>기록 추가</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {equips.map(e => {
          const isAlert = e.ccpValue > e.ccpMax || e.ccpValue < e.ccpMin;
          return (
            <Card key={e.code} className={isAlert?"border-red-400 bg-red-50/40":""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ThermometerIcon className="w-4 h-4 text-blue-500"/>
                  {e.name} <span className="font-mono text-xs font-normal text-gray-400">({e.code})</span>
                  {isAlert && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">이상 발생</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">CCP 현재값</div>
                    <div className={`text-2xl font-bold ${isAlert?"text-red-600":"text-blue-600"}`}>{e.ccpValue}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">허용범위</div>
                    <div className="text-sm font-medium text-gray-700">{e.ccpMin} ~ {e.ccpMax}</div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">습도</div>
                    <div className="text-2xl font-bold text-teal-600">{e.humidity}%</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">마지막 점검일: {e.checkDate}</div>
                {e.alertHistory.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">이상 이력</div>
                    {e.alertHistory.map((a,i)=>(
                      <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded px-2 py-1">
                        <AlertCircle className="w-3 h-3 shrink-0"/>
                        {a.time} · 측정값: {a.value}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>HACCP 기록 추가</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">설비 선택</label>
              <select className="w-full border rounded px-3 py-2 text-sm" value={targetCode} onChange={e => setTargetCode(e.target.value)}>
                <option value="">선택하세요</option>
                {equips.map(e => <option key={e.code} value={e.code}>{e.name} ({e.code})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">CCP 측정값</label>
                <input type="number" step="0.1" className="w-full border rounded px-3 py-2 text-sm" placeholder="4.2" value={form.ccpValue} onChange={e => setForm(p => ({...p, ccpValue: e.target.value}))}/>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">습도 (%)</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="62" value={form.humidity} onChange={e => setForm(p => ({...p, humidity: e.target.value}))}/>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>취소</Button>
            <Button onClick={handleAddRecord}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
