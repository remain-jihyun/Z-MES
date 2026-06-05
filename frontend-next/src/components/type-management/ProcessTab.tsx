"use client"

import { useState, useMemo } from "react"
import { useProcesses } from "@/hooks/useTypeManagement"
import { createProcess, updateProcess, reorderProcess, getSpaces } from "@/lib/api/type-management"
import type { Process } from "@/types/type-management"
import type { ProcessFormValues } from "@/lib/schemas/type-management"
import { ProcessFormDialog } from "./ProcessForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react"

const GROUP_COLORS = [
  "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500",
  "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
]

export function ProcessTab() {
  const { groups, total, loading, refetch } = useProcesses()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Process | null>(null)
  const [defaultSpaceName, setDefaultSpaceName] = useState<string>("")
  // Accordion 대체
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set())
  const [initialized, setInitialized] = useState(false)

  const groupKeys = useMemo(() => groups.map((g) => g.spaceId), [groups])

  useMemo(() => {
    if (!initialized && groupKeys.length > 0) {
      setExpandedGroups(new Set(groupKeys))
      setInitialized(true)
    }
  }, [groupKeys, initialized])

  const toggleGroup = (spaceId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(spaceId)) next.delete(spaceId)
      else next.add(spaceId)
      return next
    })
  }

  const handleSubmit = async (data: ProcessFormValues) => {
    const spaces = await getSpaces()
    const space = spaces.find((s) => s.name === data.spaceName)

    if (editItem) {
      await updateProcess(editItem.id, { ...data, spaceId: space?.id ?? editItem.spaceId, spaceName: data.spaceName })
    } else {
      await createProcess({ ...data, spaceId: space?.id ?? "", spaceName: data.spaceName })
    }
    setEditItem(null)
    refetch()
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderProcess(id, direction)
    refetch()
  }

  return (
    <div className="mt-4 max-w-4xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">공정 목록</h3>
          <Badge variant="secondary">{total}건</Badge>
          <span className="text-xs text-muted-foreground">공간별 그룹</span>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDefaultSpaceName(""); setDialogOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" />
          공정 추가
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="space-y-3">
          {groups.map((group, groupIdx) => {
            const isExpanded = expandedGroups.has(group.spaceId)
            return (
              <div key={group.spaceId} className="rounded-lg border">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.spaceId)}
                  className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${GROUP_COLORS[groupIdx % GROUP_COLORS.length]}`} />
                    <span className="font-semibold">{group.spaceName}</span>
                    <Badge variant="outline" className="text-xs">{group.items.length}건</Badge>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="border-t">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="min-w-44">공정명</TableHead>
                          <TableHead className="w-24">공간</TableHead>
                          <TableHead className="w-36">속성</TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.items.map((proc, idx) => (
                          <TableRow key={proc.id}>
                            <TableCell className="font-medium">{proc.name}</TableCell>
                            <TableCell className="text-muted-foreground">{proc.spaceName}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {proc.createKanban !== false && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">간반생성</Badge>}{proc.isCcp && <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">CCP</Badge>}
                                {proc.isCooling && <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">냉각</Badge>}
                                {proc.isInspection && <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">검수</Badge>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem disabled={idx === 0} onClick={() => handleReorder(proc.id, "up")}>
                                    <ArrowUp className="mr-2 h-4 w-4" /> 위로 이동
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled={idx === group.items.length - 1} onClick={() => handleReorder(proc.id, "down")}>
                                    <ArrowDown className="mr-2 h-4 w-4" /> 아래로 이동
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => { setEditItem(proc); setDefaultSpaceName(proc.spaceName); setDialogOpen(true) }}>수정</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <ProcessFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editItem={editItem} defaultSpaceName={defaultSpaceName} onSubmit={handleSubmit} />
    </div>
  )
}
