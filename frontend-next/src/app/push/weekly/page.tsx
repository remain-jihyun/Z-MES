"use client";
import { useState } from "react";
import { mockWeeklyPlan } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Save, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type Plan = typeof mockWeeklyPlan[0];

export default function Page() {
  const [plans, setPlans] = useState(mockWeeklyPlan);
  const [saved, setSaved] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ productCode: "", productName: "", planQty: "" });
  const [editQty, setEditQty] = useState<Record<string, string>>({});

  const confirm = (code: string) => setPlans(p => p.map(i => i.productCode === code ? { ...i, status: "확정" as const, confirmedQty: editQty[code] ? Number(editQty[code]) : i.planQty } : i));

  const save = () => {
    setPlans(p => p.map(i => editQty[i.productCode] ? { ...i, planQty: Number(editQty[i.productCode]) } : i));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAdd = () => {
    if (!form.productCode || !form.productName || !form.planQty) return;
    setPlans(p => [...p, {
      week: "2026-W23",
      productCode: form.productCode,
      productName: form.productName,
      planQty: Number(form.planQty),
      confirmedQty: null,
      status: "작성중" as const,
      author: "관리자",
    }]);
    setForm({ productCode: "", productName: "", planQty: "" });
    setAddOpen(false);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">주간 생산계획</h1>
          <p className="text-sm text-gray-500 mt-0.5">2026-W23 (2026-06-02 ~ 2026-06-06)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4"/>계획 추가</Button>
          <Button size="sm" className="gap-1.5" onClick={save}><Save className="w-4 h-4"/>{saved ? "저장 완료!" : "계획 저장"}</Button>
        </div>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-gray-50">{["주차","품목코드","제품명","계획수량","확정수량","상태","작성자",""].map(h=><th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{plans.map(p=>(
            <tr key={p.productCode} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-xs text-gray-600">{p.week}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.productCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{p.productName}</td>
              <td className="px-4 py-3 text-right">
                {p.status !== "확정" ? (
                  <input
                    type="number"
                    defaultValue={p.planQty}
                    className="w-24 border rounded px-2 py-0.5 text-sm text-right"
                    onChange={e => setEditQty(prev => ({ ...prev, [p.productCode]: e.target.value }))}
                  />
                ) : (
                  <span className="font-medium">{p.planQty.toLocaleString()}</span>
                )}
              </td>
              <td className="px-4 py-3 text-right text-gray-600">{p.confirmedQty?.toLocaleString() ?? "—"}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status==="확정"?"bg-green-100 text-green-700":"bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td>
              <td className="px-4 py-3 text-xs text-gray-500">{p.author}</td>
              <td className="px-4 py-3">{p.status!=="확정" && <Button variant="outline" size="sm" className="h-6 text-xs gap-1" onClick={()=>confirm(p.productCode)}><CheckCircle className="w-3 h-3"/>확정</Button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>계획 추가</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">품목코드</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="P-001" value={form.productCode} onChange={e => setForm(p => ({...p, productCode: e.target.value}))}/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">제품명</label>
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="닭갈비" value={form.productName} onChange={e => setForm(p => ({...p, productName: e.target.value}))}/>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600">계획 수량</label>
              <input type="number" className="w-full border rounded px-3 py-2 text-sm" placeholder="0" value={form.planQty} onChange={e => setForm(p => ({...p, planQty: e.target.value}))}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>취소</Button>
            <Button onClick={handleAdd}>추가</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
