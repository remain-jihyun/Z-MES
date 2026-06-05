"use client";
import { useState } from "react";
import { mockForecast } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Page() {
  const [forecast, setForecast] = useState(mockForecast);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);

  const handleRun = () => {
    setRunning(true);
    // Simulate AI recalculation
    setTimeout(() => {
      setForecast(prev => prev.map(r => ({
        ...r,
        coupang: Math.round(r.coupang * (0.95 + Math.random() * 0.1)),
        kurly: Math.round(r.kurly * (0.95 + Math.random() * 0.1)),
        own: Math.round(r.own * (0.95 + Math.random() * 0.1)),
        forecastQty: Math.round(r.forecastQty * (0.97 + Math.random() * 0.06)),
      })));
      setRunning(false);
      setRan(true);
    }, 800);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI 수요예측</h1>
          <p className="text-sm text-gray-500 mt-0.5">예측 기준일 2026-06-05 · 3일 전 데이터 기반</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={handleRun} disabled={running}>
          <Sparkles className="w-4 h-4"/>{running ? "예측 중…" : "예측 실행"}
        </Button>
      </div>
      {ran && (
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
          AI 예측이 완료되었습니다. 최신 주문 데이터를 반영하여 수량이 업데이트되었습니다.
        </div>
      )}
      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">자재코드</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">자재명</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 bg-yellow-50">쿠팡</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 bg-purple-50">컬리</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 bg-blue-50">자사몰</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 bg-green-50">정기식단</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 font-semibold">예측발주량</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">안전재고</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">조달기간</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">Z값</th>
            </tr>
          </thead>
          <tbody className="divide-y">{forecast.map(r=>(
            <tr key={r.materialCode} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.materialCode}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{r.materialName}</td>
              <td className="px-4 py-3 text-right text-xs bg-yellow-50/40">{r.coupang}</td>
              <td className="px-4 py-3 text-right text-xs bg-purple-50/40">{r.kurly}</td>
              <td className="px-4 py-3 text-right text-xs bg-blue-50/40">{r.own}</td>
              <td className="px-4 py-3 text-right text-xs bg-green-50/40">{r.subscription}</td>
              <td className="px-4 py-3 text-right font-bold text-blue-700">{r.forecastQty}</td>
              <td className="px-4 py-3 text-right text-xs text-gray-600">{r.safeStock}</td>
              <td className="px-4 py-3 text-right text-xs text-gray-600">{r.leadTime}일</td>
              <td className="px-4 py-3 text-right text-xs text-gray-600">{r.zValue}</td>
            </tr>
          ))}</tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}
