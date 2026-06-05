"use client";
import { useState } from "react";
import { mockLotDetail } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

export default function Page() {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<"순방향"|"역방향">("순방향");
  const [result, setResult] = useState<typeof mockLotDetail[0]|null>(null);

  const search = () => {
    const found = mockLotDetail.find(l => l.lot.includes(query)||l.product.includes(query));
    setResult(found ?? null);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">양방향 추적</h1>
      <Card>
        <CardContent className="pt-4 pb-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">조회 기준</Label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option>로트번호</option><option>제품코드</option><option>자재코드</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">추적 방향</Label>
              <div className="flex border rounded overflow-hidden">
                <button onClick={()=>setDirection("순방향")} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 ${direction==="순방향"?"bg-blue-600 text-white":"text-gray-600 hover:bg-gray-50"}`}><ArrowDown className="w-3 h-3"/>순방향</button>
                <button onClick={()=>setDirection("역방향")} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 ${direction==="역방향"?"bg-blue-600 text-white":"text-gray-600 hover:bg-gray-50"}`}><ArrowUp className="w-3 h-3"/>역방향</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">날짜 범위</Label>
              <Input type="date" className="text-sm"/>
            </div>
          </div>
          <div className="flex gap-2">
            <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="LOT-2026-0602-001 또는 P-001" className="flex-1"/>
            <Button onClick={search} className="gap-1.5"><Search className="w-4 h-4"/>추적</Button>
          </div>
        </CardContent>
      </Card>
      {result && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{direction} 추적 결과</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {direction==="역방향" ? (
                <>
                  <div className="text-xs font-medium text-gray-500 mb-2">완제품 → 원재료</div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm font-medium">[완제품] {result.name} · {result.lot}</div>
                    <div className="flex justify-center"><ArrowUp className="w-4 h-4 text-gray-400"/></div>
                    {result.rawLots.map(r=><div key={r} className="bg-green-50 border border-green-200 rounded p-3 font-mono text-xs">[원재료] {r}</div>)}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs font-medium text-gray-500 mb-2">원재료 → 완제품</div>
                  <div className="flex flex-col gap-2">
                    {result.rawLots.map(r=><div key={r} className="bg-green-50 border border-green-200 rounded p-3 font-mono text-xs">[원재료] {r}</div>)}
                    <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-gray-400"/></div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm font-medium">[완제품] {result.name} · {result.lot}</div>
                  </div>
                </>
              )}
              <div className="mt-3">
                <div className="text-xs font-medium text-gray-600 mb-2">공정 단계</div>
                <div className="space-y-1">{result.processes.map((p,i)=>(
                  <div key={i} className="flex items-center gap-3 text-xs bg-gray-50 rounded px-3 py-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium">{i+1}</span>
                    <span className="font-medium">{p.step}</span><span className="text-gray-500">{p.time}</span><span className="text-gray-600">{p.worker}</span>
                  </div>
                ))}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
