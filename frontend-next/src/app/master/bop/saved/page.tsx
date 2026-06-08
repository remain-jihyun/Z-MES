"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  getSavedProcesses, updateSavedProcessName, deleteSavedProcess,
  type SavedProcess, type SavedProcessNode, type SavedProcessEdge,
} from "@/lib/stores/saved-processes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, AlertTriangle, ChevronRight, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ── 공정 미리보기 ──────────────────────────────────────────

function ProcessPreview({ nodes, edges }: { nodes: SavedProcessNode[]; edges: SavedProcessEdge[] }) {
  if (nodes.length === 0) return <p className="text-xs text-muted-foreground">공정 노드가 없습니다.</p>

  // x 좌표 기준 정렬 후 공간(spaceLabel)별 그룹화
  const sorted = [...nodes].sort((a, b) => a.x - b.x)
  const groupOrder: string[] = []
  const groupMap: Record<string, { color: string; nodes: SavedProcessNode[] }> = {}
  sorted.forEach(n => {
    const key = n.spaceLabel || "(공간 미지정)"
    if (!groupMap[key]) { groupOrder.push(key); groupMap[key] = { color: n.groupColor, nodes: [] } }
    groupMap[key].nodes.push(n)
  })

  // 엣지 기반 연결 관계 표시 (어느 그룹 → 어느 그룹)
  const nodeGroup: Record<string, string> = {}
  sorted.forEach(n => { nodeGroup[n.id] = n.spaceLabel || "(공간 미지정)" })
  const groupEdges = new Set<string>()
  edges.forEach(e => {
    const from = nodeGroup[e.from]
    const to = nodeGroup[e.to]
    if (from && to && from !== to) groupEdges.add(`${from}→${to}`)
  })

  return (
    <div className="flex items-start gap-1.5 overflow-x-auto pb-1">
      {groupOrder.map((spaceLabel, i) => {
        const group = groupMap[spaceLabel]
        const hexAlpha = (a: string) => group.color + a
        return (
          <div key={spaceLabel} className="flex items-start gap-1.5 shrink-0">
            {i > 0 && (
              <div className="flex items-center self-stretch pt-3">
                <ArrowRight className="size-4 text-gray-400 shrink-0" />
              </div>
            )}
            <div
              className="rounded-lg border-2 p-2.5 min-w-[128px]"
              style={{ borderColor: hexAlpha("60") }}
            >
              <div className="text-[10px] font-bold mb-2 tracking-wide" style={{ color: group.color }}>
                {spaceLabel}
              </div>
              <div className="space-y-1">
                {group.nodes.map(n => (
                  <div
                    key={n.id}
                    className="rounded px-2 py-1 text-[11px] leading-tight flex items-center gap-1"
                    style={{ background: hexAlpha("12"), border: `1px solid ${hexAlpha("30")}` }}
                  >
                    <span className="truncate">{n.label}</span>
                    {n.isCcp && (
                      <span className="ml-auto shrink-0 text-[8px] bg-red-500 text-white rounded px-1 font-bold">CCP</span>
                    )}
                    {n.isInspection && !n.isCcp && (
                      <span className="ml-auto shrink-0 text-[8px] bg-amber-500 text-white rounded px-1 font-bold">검수</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── 메인 ──────────────────────────────────────────────────

export default function SavedProcessesPage() {
  const router = useRouter()
  const [processes, setProcesses] = useState<SavedProcess[]>(() => getSavedProcesses())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [renameTarget, setRenameTarget] = useState<SavedProcess | null>(null)
  const [renameName, setRenameName] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<SavedProcess | null>(null)

  const reload = () => setProcesses(getSavedProcesses())

  const toggleExpand = (id: string) => setExpandedId(prev => prev === id ? null : id)

  const handleRenameOpen = (sp: SavedProcess) => {
    setRenameTarget(sp)
    setRenameName(sp.name)
  }

  const handleRenameConfirm = () => {
    if (!renameTarget || !renameName.trim()) return
    updateSavedProcessName(renameTarget.id, renameName.trim())
    reload()
    setRenameTarget(null)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteSavedProcess(deleteTarget.id)
    reload()
    setDeleteTarget(null)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <span>기초정보</span>
            <ChevronRight className="size-3" />
            <button className="hover:underline" onClick={() => router.push("/master/bop")}>BOP 유형</button>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">저장된 공정</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">저장된 공정</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/master/bop")}>
          BOP 유형 편집
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        저장된 공정 스니펫 목록입니다. 행을 클릭하면 공정 구성을 확인할 수 있습니다.
        어떤 BOP(제품)에서 사용 중인지 영향 범위를 함께 확인하세요.
      </p>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 w-8"></th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">공정명</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">노드 수</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">사용 BOP (영향 범위)</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">생성일</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">액션</th>
              </tr>
            </thead>
            <tbody>
              {processes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    저장된 공정이 없습니다. BOP 유형 편집 화면에서 현재 공정을 저장할 수 있습니다.
                  </td>
                </tr>
              )}
              {processes.map((sp, idx) => {
                const isExpanded = expandedId === sp.id
                return (
                  <>
                    <tr
                      key={sp.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isExpanded ? "bg-gray-50 border-b-0" : "hover:bg-gray-50 border-b",
                      )}
                      onClick={() => toggleExpand(sp.id)}
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {isExpanded
                          ? <ChevronUp className="size-3.5" />
                          : <ChevronDown className="size-3.5" />}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{sp.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{sp.nodes.length}개</td>
                      <td className="px-4 py-3">
                        {sp.usedInBops.length === 0 ? (
                          <span className="text-xs text-gray-400">미사용</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {sp.usedInBops.map(b => (
                              <Badge key={b.id} variant="secondary" className="text-[10px] h-5 px-1.5 bg-blue-50 text-blue-700 border-blue-200">
                                {b.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{sp.createdAt}</td>
                      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="sm" className="h-7 w-7 p-0"
                            onClick={() => handleRenameOpen(sp)}
                            title="이름 변경"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(sp)}
                            title="삭제"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {/* 아코디언 확장 영역 */}
                    {isExpanded && (
                      <tr key={`${sp.id}-expanded`} className="border-b bg-gray-50">
                        <td colSpan={6} className="px-6 py-4">
                          <ProcessPreview nodes={sp.nodes} edges={sp.edges} />
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <div className="text-xs text-gray-400">총 {processes.length}개 저장된 공정</div>

      {/* 이름 변경 다이얼로그 */}
      <Dialog open={!!renameTarget} onOpenChange={o => !o && setRenameTarget(null)}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle>공정명 변경</DialogTitle>
          </DialogHeader>
          <Input
            value={renameName}
            onChange={e => setRenameName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleRenameConfirm()}
            placeholder="공정명 입력"
            autoFocus
          />
          {renameTarget && renameTarget.usedInBops.length > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
              <span>
                이 공정은 <strong>{renameTarget.usedInBops.map(b => b.name).join(", ")}</strong>에서 사용 중입니다.
                이름을 변경해도 해당 BOP에는 영향이 없습니다.
              </span>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRenameTarget(null)}>취소</Button>
            <Button size="sm" onClick={handleRenameConfirm} disabled={!renameName.trim()}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle>공정 삭제</DialogTitle>
          </DialogHeader>
          {deleteTarget && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{deleteTarget.name}</strong>을(를) 삭제하시겠습니까?
              </p>
              {deleteTarget.usedInBops.length > 0 && (
                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-0.5">사용 중인 공정입니다</p>
                    <p>
                      {deleteTarget.usedInBops.map(b => b.name).join(", ")}에서 이 공정을 사용하고 있습니다.
                      삭제해도 기존에 캔버스에 배치된 노드에는 영향이 없지만, 이후 재사용이 불가능합니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button
              size="sm"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
