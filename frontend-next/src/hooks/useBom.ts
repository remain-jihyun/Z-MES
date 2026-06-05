"use client"

import { useState, useEffect, useCallback } from "react"
import type { BomFilterParams, BomType, BomTreeNode, UnifiedBomParentRow } from "@/types/bom"
import {
  getUnifiedBomParents,
  getDevBomTree,
  getNormalBomTree,
  getBomComparison,
  type BomComparisonResult,
} from "@/lib/api/bom"

interface SortState {
  key: string
  direction: "asc" | "desc"
}

// 통합 모품목 목록 훅
export function useUnifiedBomList() {
  const [items, setItems] = useState<UnifiedBomParentRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<BomFilterParams>({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sort, setSort] = useState<SortState>({ key: "productCode", direction: "asc" })

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUnifiedBomParents({
        ...filters,
        page,
        pageSize,
        sortKey: sort.key,
        sortDirection: sort.direction,
      })
      setItems(res.data)
      setTotal(res.total)
    } finally {
      setLoading(false)
    }
  }, [filters, page, pageSize, sort])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const updateFilters = useCallback((newFilters: BomFilterParams) => {
    setFilters(newFilters)
    setPage(1)
  }, [])

  const updatePageSize = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const updateSort = useCallback((key: string, direction: "asc" | "desc") => {
    setSort({ key, direction })
  }, [])

  return {
    items,
    total,
    loading,
    filters,
    setFilters: updateFilters,
    page,
    setPage,
    pageSize,
    setPageSize: updatePageSize,
    sort,
    setSort: updateSort,
    refetch: fetchItems,
  }
}

// BOM 트리 조회 훅
export function useBomTree(bomType: BomType, productCode: string | null) {
  const [tree, setTree] = useState<BomTreeNode[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productCode) {
      setTree([])
      return
    }

    let cancelled = false
    setLoading(true)

    const fetcher = bomType === "DEV" ? getDevBomTree : getNormalBomTree

    fetcher(productCode).then((result) => {
      if (!cancelled) {
        setTree(result)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [bomType, productCode])

  return { tree, loading }
}

const EMPTY_COMPARISON: BomComparisonResult = {
  dev: [], normal: [], bulk: [],
  devProductionQty: 0, normalProductionQty: 0, bulkProductionQty: 0,
  productUnit: "", productWeightPerUnit: "",
}

// 3종 BOM 비교 훅
export function useBomCompare(productCode: string | null) {
  const [data, setData] = useState<BomComparisonResult>(EMPTY_COMPARISON)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productCode) {
      setData(EMPTY_COMPARISON)
      return
    }

    let cancelled = false
    setLoading(true)

    getBomComparison(productCode).then((result) => {
      if (!cancelled) {
        setData(result)
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [productCode])

  return { data, loading }
}
