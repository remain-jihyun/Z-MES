"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getItems } from "@/lib/api/products"
import { BOM_TYPE_LABELS, type BomType } from "@/types/bom"
import { ITEM_TYPE_LABELS, type ItemType } from "@/types/products"
import { cn } from "@/lib/utils"

type Material = {
  materialCode: string
  materialName: string
  unit: string
  qty: string
}

const EMPTY_MATERIAL: Material = { materialCode: "", materialName: "", unit: "g", qty: "" }
const BOM_TYPES: BomType[] = ["DEV", "NORMAL", "BULK"]

export default function BomRegisterPage() {
  const router = useRouter()

  const [products, setProducts] = useState<{ code: string; name: string; unit: string | null; type: string | null; weightPerUnit: string | null }[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const [selectedTypes, setSelectedTypes] = useState<BomType[]>(["NORMAL"])
  const [validFrom, setValidFrom] = useState("2026-01-01")
  const [validTo, setValidTo] = useState("2026-12-31")
  const [materials, setMaterials] = useState<Material[]>([{ ...EMPTY_MATERIAL }])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getItems({ pageSize: 999 }).then(r => setProducts(r.data.map(p => ({
      code: p.code, name: p.name, unit: p.unit, type: p.type, weightPerUnit: p.weightPerUnit
    }))))
  }, [])

  const filteredProducts = products.filter(p =>
    p.name.includes(productSearch) || p.code.includes(productSearch)
  ).slice(0, 8)

  const selectProduct = (p: typeof products[0]) => {
    setSelectedProduct(p)
    setProductSearch(p.name)
    setShowDropdown(false)
  }

  const toggleType = (t: BomType) => {
    setSelectedTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  const addMaterial = () => setMaterials(prev => [...prev, { ...EMPTY_MATERIAL }])
  const removeMaterial = (i: number) => setMaterials(prev => prev.filter((_, idx) => idx !== i))
  const updateMaterial = (i: number, field: keyof Material, value: string) =>
    setMaterials(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m))

  const handleSave = () => {
    if (!selectedProduct || selectedTypes.length === 0) return
    setSaved(true)
    setTimeout(() => {
      router.push("/master/bom")
    }, 800)
  }

  const isValid = selectedProduct && selectedTypes.length > 0 && materials.some(m => m.materialCode && m.qty)

  return (
    <div className="space-y-6 px-4 lg:px-6 pb-8">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">기초정보 &gt; BOM</p>
          <h1 className="text-2xl font-bold tracking-tight">BOM 신규 등록</h1>
        </div>
      </div>

      {/* 생산품목 선택 */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-sm font-semibold">생산품목 선택 *</h3>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">품목코드 / 품목명 검색</Label>
            <div className="relative">
              <Input
                placeholder="코드 또는 품목명 입력"
                value={productSearch}
                onChange={e => { setProductSearch(e.target.value); setShowDropdown(true); setSelectedProduct(null) }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              {showDropdown && productSearch && filteredProducts.length > 0 && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-popover border rounded-lg shadow-md max-h-52 overflow-y-auto">
                  {filteredProducts.map(p => (
                    <button
                      key={p.code}
                      type="button"
                      onMouseDown={() => selectProduct(p)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
                    >
                      <span className="font-mono text-xs text-muted-foreground w-24 shrink-0">{p.code}</span>
                      <span className="font-medium">{p.name}</span>
                      {p.type && (
                        <Badge variant="outline" className="ml-auto text-[10px]">
                          {ITEM_TYPE_LABELS[p.type as ItemType] ?? p.type}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedProduct && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">품목코드</Label>
                <div className="h-9 flex items-center px-3 rounded-md border bg-muted/50 text-sm font-mono">{selectedProduct.code}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">품목명</Label>
                <div className="h-9 flex items-center px-3 rounded-md border bg-muted/50 text-sm">{selectedProduct.name}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">단위</Label>
                <div className="h-9 flex items-center px-3 rounded-md border bg-muted/50 text-sm">{selectedProduct.unit ?? "—"}</div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">단위당 중량</Label>
                <div className="h-9 flex items-center px-3 rounded-md border bg-muted/50 text-sm">{selectedProduct.weightPerUnit ?? "—"}</div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* BOM 유형 + 유효기간 */}
      <Card>
        <CardHeader className="pb-3">
          <h3 className="text-sm font-semibold">BOM 유형 및 유효기간 *</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">BOM 유형 (복수 선택 가능)</Label>
            <div className="flex gap-2 flex-wrap">
              {BOM_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md border transition-colors",
                    selectedTypes.includes(t)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-input hover:bg-muted"
                  )}
                >
                  {BOM_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">유효기간 시작 *</Label>
              <Input type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">유효기간 종료 *</Label>
              <Input type="date" value={validTo} onChange={e => setValidTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 자재 목록 */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <h3 className="text-sm font-semibold">자재 목록 *</h3>
          <Button size="sm" variant="outline" className="gap-1" onClick={addMaterial}>
            <Plus className="size-3.5" />자재 추가
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 헤더 */}
          <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground px-1">
            <span className="col-span-3">자재코드</span>
            <span className="col-span-4">자재명</span>
            <span className="col-span-2">단위</span>
            <span className="col-span-2">기준 수량</span>
            <span className="col-span-1" />
          </div>
          <Separator />
          {materials.map((m, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-3">
                <Input
                  placeholder="RM-001"
                  value={m.materialCode}
                  onChange={e => updateMaterial(i, "materialCode", e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="col-span-4">
                <Input
                  placeholder="닭고기"
                  value={m.materialName}
                  onChange={e => updateMaterial(i, "materialName", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={m.unit}
                  onChange={e => updateMaterial(i, "unit", e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {["g", "kg", "EA", "mL", "L", "개"].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="0"
                  value={m.qty}
                  onChange={e => updateMaterial(i, "qty", e.target.value)}
                  className="h-8 text-sm text-right"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeMaterial(i)}
                  disabled={materials.length === 1}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive disabled:opacity-30"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">총 {materials.filter(m => m.materialCode).length}개 자재</p>
        </CardContent>
      </Card>

      {/* 저장 */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => router.back()}>취소</Button>
        <Button
          className="gap-1.5"
          onClick={handleSave}
          disabled={!isValid || saved}
        >
          <Save className="size-4" />
          {saved ? "저장 완료! 이동 중…" : "BOM 저장"}
        </Button>
      </div>
    </div>
  )
}
