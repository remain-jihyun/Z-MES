"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getItems } from "@/lib/api/products";
import { Card, CardContent } from "@/components/ui/card";
import { ProductDetailDialog } from "@/components/products/ProductDetailDialog";
import { ProductsToolbar } from "@/components/products/ProductsToolbar";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { ItemDetail, ItemFilterParams } from "@/types/products";
import { ITEM_TYPE_LABELS, STORAGE_METHOD_LABELS } from "@/types/products";

type SortKey = "code" | "name" | "type" | "storageMethod" | "purchasePrice" | "salePrice"
type SortDir = "asc" | "desc"

const PAGE_SIZES = [20, 50, 100, 200]

const COLUMNS: { key: SortKey | string; label: string; sortable?: boolean; align?: "right" }[] = [
  { key: "code", label: "품목코드", sortable: true },
  { key: "name", label: "품목명", sortable: true },
  { key: "type", label: "품목구분", sortable: true },
  { key: "unit", label: "단위" },
  { key: "weightPerUnit", label: "단위당 중량" },
  { key: "storageMethod", label: "보관방법", sortable: true },
  { key: "purchasePrice", label: "입고단가", sortable: true, align: "right" },
  { key: "salePrice", label: "권장판매가", sortable: true, align: "right" },
  { key: "companyId", label: "거래처" },
  { key: "stockControl", label: "재고관리" },
  { key: "isActive", label: "상태" },
]

function SortIcon({ col, sortKey, sortDir }: { col: string; sortKey: string | null; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="inline ml-1 size-3 text-gray-300" />
  return sortDir === "asc"
    ? <ArrowUp className="inline ml-1 size-3 text-blue-600" />
    : <ArrowDown className="inline ml-1 size-3 text-blue-600" />
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const half = 2
  let start = Math.max(1, current - half)
  let end = Math.min(total, current + half)
  if (end - start < 4) {
    if (start === 1) end = Math.min(total, 5)
    else start = Math.max(1, end - 4)
  }
  const pages: (number | "...")[] = []
  if (start > 1) { pages.push(1); if (start > 2) pages.push("...") }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total) { if (end < total - 1) pages.push("..."); pages.push(total) }
  return pages
}

export default function ProductsPage() {
  const [items, setItems] = useState<ItemDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ItemFilterParams>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCode, setEditCode] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await getItems({
      ...filters,
      page,
      pageSize,
      sortKey: sortKey as keyof ItemDetail | undefined,
      sortDirection: sortKey ? sortDir : undefined,
    });
    setItems(result.data);
    setTotal(result.total);
  }, [filters, page, pageSize, sortKey, sortDir]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (f: ItemFilterParams) => {
    setFilters(f);
    setPage(1);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleCreate = () => { setEditCode(null); setDialogOpen(true); };
  const handleRowClick = (code: string) => { setEditCode(code); setDialogOpen(true); };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">품목 DB</h1>
      </div>

      <ProductsToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onCreateClick={handleCreate}
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="sticky top-0 z-10">
              <tr className="border-b bg-gray-50">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-xs font-medium text-gray-500 ${col.align === "right" ? "text-right" : "text-left"} ${col.key === "code" ? "sticky left-0 bg-gray-50 z-20" : ""} ${col.key === "name" ? "sticky left-28 bg-gray-50 z-20 min-w-36" : ""} ${col.sortable ? "cursor-pointer select-none hover:text-gray-700" : ""}`}
                    onClick={col.sortable ? () => handleSort(col.key as SortKey) : undefined}
                  >
                    {col.label}
                    {col.sortable && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((p) => (
                <tr
                  key={p.code}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(p.code)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-600 sticky left-0 bg-white w-28">{p.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 sticky left-28 bg-white min-w-36">{p.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {p.type ? (
                      <span className="px-2 py-0.5 rounded border text-xs">{ITEM_TYPE_LABELS[p.type]}</span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.unit ?? "-"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.weightPerUnit ?? "-"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {p.storageMethod ? (
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-xs">{STORAGE_METHOD_LABELS[p.storageMethod]}</span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {p.purchasePrice != null ? `${p.purchasePrice.toLocaleString()}원` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {p.salePrice != null && p.salePrice > 0 ? `${p.salePrice.toLocaleString()}원` : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{p.companyId ?? "-"}</td>
                  <td className="px-4 py-3 text-xs text-center">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${p.stockControl === "Y" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
                      {p.stockControl ?? "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive === "Y" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      {p.isActive === "Y" ? "사용중" : "사용중단"}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-sm text-gray-400">
                    조건에 맞는 품목이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>총 {total.toLocaleString()}건 중 {((page - 1) * pageSize + 1).toLocaleString()}–{Math.min(page * pageSize, total).toLocaleString()}</span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-50"
          >
            ‹
          </button>
          {pageNumbers.map((n, i) =>
            n === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1">…</span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n as number)}
                className={`px-2.5 py-1 rounded border text-xs ${page === n ? "bg-blue-600 text-white border-blue-600" : "hover:bg-gray-50"}`}
              >
                {n}
              </button>
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded border disabled:opacity-30 hover:bg-gray-50"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-1">
          <span>행수</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="border rounded px-1.5 py-0.5 text-xs"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <ProductDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editCode={editCode}
        onSaved={load}
      />
    </div>
  );
}
