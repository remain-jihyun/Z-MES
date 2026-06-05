"use client";

import { mockKanbanStats, mockKanbans } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const statusColor = {
  완료: "bg-green-100 text-green-700",
  진행: "bg-blue-100 text-blue-700",
  대기: "bg-gray-100 text-gray-500",
};

const chartData = [
  { team: "1반", 완료: 12, 진행: 3, 대기: 1 },
  { team: "2반", 완료: 8, 진행: 4, 대기: 2 },
  { team: "3반", 완료: 7, 진행: 2, 대기: 3 },
  { team: "4반", 완료: 4, 진행: 1, 대기: 1 },
];

export default function StatsPage() {
  const { total, completed, inProgress, waiting, rate } = mockKanbanStats;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">생산통계</h1>
        <p className="text-sm text-gray-500 mt-0.5">2026-06-02 기준 · 1분마다 자동 갱신</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "간반 총 수량", value: total, unit: "건", color: "text-gray-900" },
          { label: "완료", value: completed, unit: "건", color: "text-green-600" },
          { label: "진행 중", value: inProgress, unit: "건", color: "text-blue-600" },
          { label: "대기", value: waiting, unit: "건", color: "text-gray-400" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-5 pb-4">
              <div className="text-xs text-gray-500 mb-1">{item.label}</div>
              <div className={`text-3xl font-bold ${item.color}`}>
                {item.value}
                <span className="text-sm font-normal ml-1 text-gray-400">{item.unit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">생산 진행률</span>
            <span className="text-lg font-bold text-blue-600">{rate}%</span>
          </div>
          <Progress value={rate} className="h-3" />
        </CardContent>
      </Card>

      {/* Chart + Table */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">반별 간반 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="team" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="완료" stackId="a" fill="#22c55e" />
                <Bar dataKey="진행" stackId="a" fill="#3b82f6" />
                <Bar dataKey="대기" stackId="a" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">간반 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y max-h-[220px] overflow-y-auto">
              {mockKanbans.map((k) => (
                <div key={k.id} className="flex items-center justify-between px-4 py-2.5">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{k.id}</div>
                    <div className="text-xs text-gray-500">{k.team} · {k.product}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[k.status]}`}>
                    {k.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
