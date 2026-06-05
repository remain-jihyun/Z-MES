"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockExpansion } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Play, Layers } from "lucide-react";

export default function ExpansionPage() {
  const router = useRouter();
  const [data, setData] = useState(mockExpansion);
  const [expanded, setExpanded] = useState(false);
  const [editedQty, setEditedQty] = useState<Record<string, number>>({});

  const handleExpand = () => {
    const calculated = data.map(row => ({
      ...row,
      convertedQty: Math.round(row.convertedQty * (row.preYield / 100) * (row.coolYield / 100) * (row.packYield / 100) / 10) * 10,
    }));
    setData(calculated);
    setExpanded(true);
  };

  const updateQty = (rawCode: string, val: string) => {
    setEditedQty(prev => ({ ...prev, [rawCode]: Number(val) }));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="text-gray-400">생산계획 PULL</span>
            <span>›</span>
            <span className="text-blue-600 font-medium">2단계: 전개</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">전개</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/production/order")}>
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 주문
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExpand} disabled={expanded}>
            <Play className="w-3.5 h-3.5" />
            {expanded ? "전개 완료" : "전개 실행"}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/production/kanban")}>
            <Layers className="w-3.5 h-3.5" />
            간반 생성
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => router.push("/production/kanban")}>
            간반 이동
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
          전개 실행 완료 — 수율 기준으로 환산 수량이 계산되었습니다. 수량을 직접 조정할 수 있습니다.
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["원재료 코드", "로컬 코드", "원재료명", "전처리 수율", "냉각 수율", "포장 수율", "환산 수량"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.rawCode}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.localCode}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${row.preYield < 80 ? "text-red-500 font-medium" : "text-gray-700"}`}>
                      {row.preYield}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.coolYield}%</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.packYield}%</td>
                  <td className="px-4 py-3">
                    {expanded ? (
                      <input
                        type="number"
                        defaultValue={editedQty[row.rawCode] ?? row.convertedQty}
                        className="w-20 border rounded px-2 py-0.5 text-sm text-right"
                        onChange={e => updateQty(row.rawCode, e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {!expanded && (
        <p className="text-xs text-gray-400">수율 기준값은 기초정보 &gt; 수율에서 관리됩니다. 전개 실행 버튼을 누르면 환산 수량이 자동 계산됩니다.</p>
      )}
    </div>
  );
}
