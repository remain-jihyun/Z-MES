"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockOrders } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { GripVertical, RefreshCw, ArrowRight } from "lucide-react";

const channelColor: Record<string, string> = {
  쿠팡: "bg-yellow-100 text-yellow-700",
  컬리: "bg-purple-100 text-purple-700",
  자사몰: "bg-blue-100 text-blue-700",
  스마트스토어: "bg-green-100 text-green-700",
  "다파는 농부": "bg-orange-100 text-orange-700",
};

type Order = typeof mockOrders[0] & { priority?: string; fromWes?: boolean };

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders.map(o => ({ ...o, priority: "보통" })));
  const [wesLoaded, setWesLoaded] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);
  const [editQty, setEditQty] = useState("");
  const [editChannel, setEditChannel] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const handleWes = () => {
    setOrders(prev => [
      ...prev,
      { id: "ORD-2026-006", productCode: "P-003", productName: "시금치나물", spec: "150g", unit: "팩", qty: 120, channel: "자사몰", order: 6, priority: "긴급", fromWes: true },
    ]);
    setWesLoaded(true);
  };

  const openEdit = (order: Order) => {
    if (order.fromWes) return;
    setSelected(order);
    setEditQty(String(order.qty));
    setEditChannel(order.channel);
    setEditPriority(order.priority ?? "보통");
  };

  const saveEdit = () => {
    if (!selected) return;
    setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, qty: Number(editQty), channel: editChannel, priority: editPriority } : o));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="text-gray-400">생산계획 PULL</span>
            <span>›</span>
            <span className="text-blue-600 font-medium">1단계: 주문</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">주문</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleWes} disabled={wesLoaded}>
            <RefreshCw className="w-3.5 h-3.5" />
            {wesLoaded ? "WES 수신 완료" : "WES 수신"}
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => router.push("/production/expansion")}>
            전개로 이동
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {wesLoaded && (
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
          WES에서 1건 수신 완료 (ORD-2026-006)
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-8">순서</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">주문번호</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">품목코드</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">제품명</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">규격</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">수량</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">단위</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">채널</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">우선순위</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500">생산순서</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`transition-colors ${order.fromWes ? "bg-blue-50/30 cursor-default" : "hover:bg-gray-50 cursor-pointer"}`}
                  onClick={() => openEdit(order)}
                >
                  <td className="px-4 py-3 text-gray-400">
                    <GripVertical className="w-4 h-4" />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{order.id}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{order.productCode}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{order.productName}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{order.spec}</td>
                  <td className="px-4 py-3 text-right font-medium">{order.qty.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{order.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${channelColor[order.channel] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.priority === "긴급" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                      {order.priority ?? "보통"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-gray-700">{order.order}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-400">총 {orders.length}건 · WES 연동 · 행 클릭으로 수정</div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>주문 수정 — {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">품목코드</div>
                  <div className="font-mono font-medium">{selected.productCode}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">제품명</div>
                  <div className="font-medium">{selected.productName}</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">수량</label>
                <input
                  type="number"
                  value={editQty}
                  onChange={e => setEditQty(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">채널</label>
                <select
                  value={editChannel}
                  onChange={e => setEditChannel(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {["쿠팡", "컬리", "자사몰", "스마트스토어", "다파는 농부"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600">우선순위</label>
                <select
                  value={editPriority}
                  onChange={e => setEditPriority(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="보통">보통</option>
                  <option value="긴급">긴급</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>취소</Button>
            <Button onClick={saveEdit}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
