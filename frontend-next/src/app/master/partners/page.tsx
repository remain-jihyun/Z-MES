"use client";
import { useState, useEffect } from "react";
import { getSuppliers, type Supplier } from "@/lib/api/suppliers";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const methodStyle: Record<string, string> = {
  "이메일": "bg-blue-100 text-blue-700",
  "카카오톡": "bg-yellow-100 text-yellow-700",
  "문자": "bg-green-100 text-green-700",
  "엑셀 다운로드": "bg-purple-100 text-purple-700",
}

export default function Page() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    setSuppliers(getSuppliers())
  }, [])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">거래처</h1>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-700">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>거래처 정보는 <strong>Z-MIS</strong>에서 입력 및 수정합니다. Z-MIS 내 발주 사용 여부가 체크된 거래처만 MES로 연동됩니다.</span>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {["거래처코드", "거래처명", "담당자", "연락처", "발주 방식", "발주 연동"].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.map(s => (
                <tr key={s.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.contact}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{s.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${methodStyle[s.orderMethod] ?? ""}`}>
                      {s.orderMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.useOrder ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      {s.useOrder ? "연동" : "미사용"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400">총 {suppliers.length}건</div>
    </div>
  )
}
