"use client";

import { mockHaccpData, mockKanbanStats } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function OfficePage() {
  const { temperature, humidity, ccpValue, ccpStandard, history, lastUpdated } = mockHaccpData;
  const isAlert = temperature > ccpStandard.max || temperature < ccpStandard.min;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">사무실관제</h1>
        <p className="text-sm text-gray-500 mt-0.5">생산 모니터 + 품질 모니터 · {lastUpdated}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 생산 모니터 */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">생산 현황</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "총 간반", value: mockKanbanStats.total, unit: "건", color: "text-gray-900" },
              { label: "진행률", value: `${mockKanbanStats.rate}%`, unit: "", color: "text-blue-600" },
              { label: "완료", value: mockKanbanStats.completed, unit: "건", color: "text-green-600" },
              { label: "미완료", value: mockKanbanStats.inProgress + mockKanbanStats.waiting, unit: "건", color: "text-orange-500" },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="pt-4 pb-3">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className={`text-2xl font-bold mt-1 ${item.color}`}>
                    {item.value}
                    {item.unit && <span className="text-sm font-normal ml-1 text-gray-400">{item.unit}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 품질 모니터 */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">품질 · HACCP</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className={isAlert ? "border-red-400 bg-red-50" : ""}>
              <CardContent className="pt-4 pb-3">
                <div className="text-xs text-gray-500">온도</div>
                <div className={`text-2xl font-bold mt-1 ${isAlert ? "text-red-600" : "text-blue-600"}`}>
                  {temperature}℃
                </div>
                <div className="text-xs text-gray-400 mt-0.5">기준 {ccpStandard.min}~{ccpStandard.max}℃</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="text-xs text-gray-500">습도</div>
                <div className="text-2xl font-bold mt-1 text-teal-600">{humidity}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="text-xs text-gray-500">CCP 현재값</div>
                <div className="text-2xl font-bold mt-1 text-gray-800">{ccpValue}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">오늘 온도 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={history}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[-2, 8]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={ccpStandard.max} stroke="#ef4444" strokeDasharray="4 2" label={{ value: "상한", fontSize: 10 }} />
              <ReferenceLine y={ccpStandard.min} stroke="#3b82f6" strokeDasharray="4 2" label={{ value: "하한", fontSize: 10 }} />
              <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} name="온도(℃)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
