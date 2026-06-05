"use client";

import { useState } from "react";
import { mockInventory } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const statusStyle = {
  정상: "bg-green-100 text-green-700",
  임박: "bg-yellow-100 text-yellow-700",
  초과: "bg-red-100 text-red-700",
};

type Item = typeof mockInventory[0];

export default function InventoryStatusPage() {
  const [filter, setFilter] = useState<string>("전체");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);

  const filtered = mockInventory
    .filter((i) => filter === "전체" || i.status === filter)
    .filter((i) => i.name.includes(search) || i.code.includes(search));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">재고현황</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input className="pl-9 w-52 h-8 text-sm" placeholder="자재명/코드 검색" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex border rounded overflow-hidden text-sm">
            {["전체", "정상", "임박", "초과"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs ${filter === f ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["자재코드", "자재명", "창고 위치", "현재 수량", "단위", "소비기한", "상태"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((item) => (
                <tr
                  key={item.code}
                  className={`hover:bg-gray-50 cursor-pointer ${item.status === "초과" ? "bg-red-50/40" : item.status === "임박" ? "bg-yellow-50/40" : ""}`}
                  onClick={() => setSelected(item)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.location}</td>
                  <td className="px-4 py-3 text-right font-medium">{item.qty}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.unit}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{item.expiry}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400">총 {filtered.length}건</div>

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>재고 상세 — {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-gray-500">자재코드</span><div className="font-mono font-medium mt-0.5">{selected.code}</div></div>
                <div><span className="text-xs text-gray-500">자재명</span><div className="font-medium mt-0.5">{selected.name}</div></div>
                <div><span className="text-xs text-gray-500">창고 위치</span><div className="mt-0.5">{selected.location}</div></div>
                <div><span className="text-xs text-gray-500">현재 수량</span><div className="font-medium mt-0.5">{selected.qty} {selected.unit}</div></div>
                <div><span className="text-xs text-gray-500">소비기한</span><div className="mt-0.5">{selected.expiry}</div></div>
                <div><span className="text-xs text-gray-500">재고 상태</span>
                  <div className="mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[selected.status]}`}>{selected.status}</span>
                  </div>
                </div>
              </div>
              {selected.status !== "정상" && (
                <div className={`rounded p-3 text-xs ${selected.status === "초과" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"}`}>
                  {selected.status === "초과" ? "소비기한이 이미 지났습니다. 즉시 폐기 처리를 검토하세요." : "소비기한이 임박합니다. 조속히 사용 또는 발주 검토하세요."}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
