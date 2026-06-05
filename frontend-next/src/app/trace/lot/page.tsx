"use client";
import { useState } from "react";
import { mockLotDetail } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof mockLotDetail[0]|null>(null);
  const filtered = mockLotDetail.filter(l => l.lot.includes(search)||l.name.includes(search));
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-gray-900">로트 관리</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <Input className="pl-9 text-sm" placeholder="로트번호/제품명 검색" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <Card><CardContent className="p-0">
            <div className="divide-y">
              {filtered.map(l=>(
                <div key={l.lot} className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 ${selected?.lot===l.lot?"bg-blue-50":""}`} onClick={()=>setSelected(l)}>
                  <div>
                    <div className="font-mono text-xs font-medium text-gray-800">{l.lot}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{l.name} · {l.qty}팩 · {l.productionDate}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400"/>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </div>
        {selected && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">로트 상세</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-gray-500">로트번호</span><div className="font-mono font-medium mt-0.5">{selected.lot}</div></div>
                <div><span className="text-xs text-gray-500">제품명</span><div className="font-medium mt-0.5">{selected.name}</div></div>
                <div><span className="text-xs text-gray-500">생산일</span><div className="mt-0.5">{selected.productionDate}</div></div>
                <div><span className="text-xs text-gray-500">수량</span><div className="font-medium mt-0.5">{selected.qty}팩</div></div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2">원재료 로트</div>
                <div className="space-y-1">{selected.rawLots.map(r=><div key={r} className="text-xs font-mono bg-gray-50 rounded px-2 py-1.5">{r}</div>)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2">공정 이력</div>
                <div className="space-y-1">{selected.processes.map((p,i)=>(
                  <div key={i} className="flex items-center gap-3 text-xs bg-gray-50 rounded px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"/>
                    <span className="font-medium w-16">{p.step}</span>
                    <span className="text-gray-500">{p.time}</span>
                    <span className="text-gray-600">{p.worker}</span>
                    <span className={`ml-auto ${p.result==="정상"?"text-green-600":"text-red-600"}`}>{p.result}</span>
                  </div>
                ))}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
