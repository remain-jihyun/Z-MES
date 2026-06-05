"use client"

import { useState, useMemo } from "react"
import { useSpaces, useProcesses } from "@/hooks/useTypeManagement"
import { createSpace, updateSpace, reorderSpace, getTemperatures } from "@/lib/api/type-management"
import { SPACE_TYPE_LABELS, CLEAN_ZONE_LABELS } from "@/types/type-management"
import type { Space } from "@/types/type-management"
import type { SpaceFormValues } from "@/lib/schemas/type-management"
import { SpaceFormDialog } from "./SpaceForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const FLOOR_COLOR_CYCLE = [
  "bg-green-500", "bg-orange-500", "bg-blue-500", "bg-purple-500",
  "bg-pink-500", "bg-teal-500", "bg-amber-500", "bg-indigo-500",
]

export function SpaceTab() {
  const { grouped, total, loading, refetch } = useSpaces()
  const { groups: processGroups } = useProcesses()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Space | null>(null)
  // Accordion 대체: 층별 열림 상태
  const [expandedFloors, setExpandedFloors] = useState<Set<string>>(() => {
    // 초기에 모두 열려있음
    return new Set()
  })
  const [initialized, setInitialized] = useState(false)

  // floors가 로딩된 후 초기화
  const floors = useMemo(() => Array.from(grouped.keys()), [grouped])

  useMemo(() => {
    if (!initialized && floors.length > 0) {
      setExpandedFloors(new Set(floors))
      setInitialized(true)
    }
  }, [floors, initialized])

  const toggleFloor = (floor: string) => {
    setExpandedFloors((prev) => {
      const next = new Set(prev)
      if (next.has(floor)) next.delete(floor)
      else next.add(floor)
      return next
    })
  }

  const processCountBySpace = useMemo(() => {
    const map = new Map<string, number>()
    for (const g of processGroups) {
      map.set(g.spaceId, g.items.length)
    }
    return map
  }, [processGroups])

  const handleSubmit = async (data: SpaceFormValues) => {
    const temperatures = await getTemperatures()
    const temp = temperatures.find((t) => t.name === data.temperatureName)
    if (editItem) {
      await updateSpace(editItem.id, { ...data, temperatureId: temp?.id ?? null, temperatureName: data.temperatureName })
    } else {
      await createSpace({ ...data, temperatureId: temp?.id ?? null, temperatureName: data.temperatureName })
    }
    setEditItem(null)
    refetch()
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderSpace(id, direction)
    refetch()
  }

  return (
    <div className="mt-4 max-w-5xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">공간 목록</h3>
          <Badge variant="secondary">{total}건</Badge>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" />
          공간 추가
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="space-y-3">
          {Array.from(grouped.entries()).map(([floor, spaces], floorIdx) => {
            const isExpanded = expandedFloors.has(floor)
            return (
              <div key={floor} className="rounded-lg border">
                {/* Accordion 헤더 */}
                <button
                  type="button"
                  onClick={() => toggleFloor(floor)}
                  className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${FLOOR_COLOR_CYCLE[floorIdx % FLOOR_COLOR_CYCLE.length]}`} />
                    <span className="font-semibold">{floor}</span>
                    <Badge variant="outline" className="text-xs">{spaces.length}건</Badge>
                  </div>
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                </button>

                {/* Accordion 콘텐츠 */}
                {isExpanded && (
                  <div className="border-t">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="min-w-40">공간명</TableHead>
                          <TableHead className="w-20">유형</TableHead>
                          <TableHead className="w-20">청결</TableHead>
                          <TableHead className="w-16">뎁스</TableHead>
                          <TableHead className="w-16">온도</TableHead>
                          <TableHead className="w-20 text-center">공정 수</TableHead>
                          <TableHead className="w-10" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {spaces.map((space, idx) => (
                          <TableRow key={space.id}>
                            <TableCell className="font-medium" style={{ paddingLeft: `${(space.depth - 1) * 16 + 8}px` }}>
                              <div className="flex items-center gap-1.5">
                                <span className={`inline-block h-2 w-2 rounded-full ${space.spaceType === "WORKSHOP" ? "bg-blue-400" : "bg-amber-400"}`} />
                                {space.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={space.spaceType === "WORKSHOP" ? "default" : "secondary"}>{SPACE_TYPE_LABELS[space.spaceType]}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                space.cleanZone === "CLEAN" ? "border-green-300 text-green-700 bg-green-50"
                                  : space.cleanZone === "SEMI_CLEAN" ? "border-yellow-300 text-yellow-700 bg-yellow-50" : ""
                              )}>{CLEAN_ZONE_LABELS[space.cleanZone]}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{space.depth}</TableCell>
                            <TableCell className="text-muted-foreground">{space.temperatureName ?? "-"}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{processCountBySpace.get(space.id) ?? 0}건</Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem disabled={idx === 0} onClick={() => handleReorder(space.id, "up")}>
                                    <ArrowUp className="mr-2 h-4 w-4" /> 위로 이동
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled={idx === spaces.length - 1} onClick={() => handleReorder(space.id, "down")}>
                                    <ArrowDown className="mr-2 h-4 w-4" /> 아래로 이동
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => { setEditItem(space); setDialogOpen(true) }}>수정</DropdownMenuItem>
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

      <SpaceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editItem={editItem} onSubmit={handleSubmit} />
    </div>
  )
}
