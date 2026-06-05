"use client"

import { useState } from "react"
import { useTemperatures, useSpaces } from "@/hooks/useTypeManagement"
import { createTemperature, updateTemperature, reorderTemperature } from "@/lib/api/type-management"
import { formatTemperatureRange, THRESHOLD_TYPE_LABELS } from "@/types/type-management"
import type { Temperature } from "@/types/type-management"
import type { TemperatureFormValues } from "@/lib/schemas/type-management"
import { TemperatureFormDialog } from "./TemperatureForm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, ArrowUp, ArrowDown } from "lucide-react"

export function TemperatureTab() {
  const { items, loading, refetch } = useTemperatures()
  const { allSpaces } = useSpaces()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Temperature | null>(null)

  const getReferenceCount = (tempId: string) =>
    allSpaces.filter((s) => s.temperatureId === tempId).length

  const handleSubmit = async (data: TemperatureFormValues) => {
    if (editItem) {
      await updateTemperature(editItem.id, data)
    } else {
      await createTemperature(data)
    }
    setEditItem(null)
    refetch()
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    await reorderTemperature(id, direction)
    refetch()
  }

  return (
    <div className="mt-4 max-w-4xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">온도 유형</h3>
          <Badge variant="secondary">{items.length}건</Badge>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" />
          온도 유형 추가
        </Button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-muted-foreground">로딩 중...</div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-28">명칭</TableHead>
                <TableHead className="w-24">임계 유형</TableHead>
                <TableHead className="w-32">범위</TableHead>
                <TableHead>설명</TableHead>
                <TableHead className="w-24 text-center">사용 중</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{THRESHOLD_TYPE_LABELS[item.thresholdType]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatTemperatureRange(item)}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-48">{item.description}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{getReferenceCount(item.id)}개 공간</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={idx === 0} onClick={() => handleReorder(item.id, "up")}>
                          <ArrowUp className="mr-2 h-4 w-4" /> 위로 이동
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={idx === items.length - 1} onClick={() => handleReorder(item.id, "down")}>
                          <ArrowDown className="mr-2 h-4 w-4" /> 아래로 이동
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setEditItem(item); setDialogOpen(true) }}>수정</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TemperatureFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editItem={editItem} onSubmit={handleSubmit} />
    </div>
  )
}
