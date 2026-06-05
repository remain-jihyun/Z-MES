"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import type { DailyMealPlan, SyncStatus } from "@/types/meal-plan"
import type { CalendarViewMode } from "@/hooks/useMealPlanCalendar"

const SYNC_LABEL: Record<SyncStatus, string> = {
  synced: "연동완료",
  pending: "대기중",
  failed: "연동실패",
  not_synced: "미연동",
}

interface ScheduleDetailSheetProps {
  schedule: DailyMealPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (plan: DailyMealPlan) => void
  onDelete: (id: string) => void
  viewMode: CalendarViewMode
}

function addDaysUtil(d: Date, n: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + n)
  return result
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function ScheduleDetailSheet({
  schedule,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  viewMode,
}: ScheduleDetailSheetProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!schedule) return null

  const deliveryDate = schedule.date
  const productionDate = formatDateStr(
    addDaysUtil(new Date(schedule.date + "T00:00:00"), -1),
  )

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{schedule.mealPlanName}</SheetTitle>
            <SheetDescription>
              {viewMode === "production"
                ? `생산일 ${productionDate} (수령일 ${deliveryDate})`
                : `수령일 ${deliveryDate} (생산일 ${productionDate})`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">식단코드</span>
                <p className="font-mono text-xs">{schedule.mealPlanCode}</p>
              </div>
              <div>
                <span className="text-muted-foreground">연동상태</span>
                <p>
                  <Badge
                    variant={schedule.syncStatus === "synced" ? "default" : "secondary"}
                  >
                    {SYNC_LABEL[schedule.syncStatus]}
                  </Badge>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">구성품 수</span>
                <p className="font-medium">{schedule.items.length}개</p>
              </div>
              <div>
                <span className="text-muted-foreground">수정일</span>
                <p>{schedule.updatedAt.split("T")[0]}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">구성품 목록</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">#</TableHead>
                    <TableHead>품목코드</TableHead>
                    <TableHead>제품명</TableHead>
                    <TableHead className="text-right">중량</TableHead>
                    <TableHead className="w-[50px] text-right">수량</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.items.map((item, idx) => (
                    <TableRow key={item.zipCode}>
                      <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-mono text-xs">{item.zipCode}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {item.weight}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <SheetFooter className="px-4">
            <div className="flex w-full gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(schedule)}
              >
                <Pencil className="h-4 w-4" />
                수정
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                삭제
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* 삭제 확인 다이얼로그 (AlertDialog 대체) */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>식단 삭제</DialogTitle>
            <DialogDescription>
              &quot;{schedule.mealPlanName}&quot; ({schedule.date}) 식단을
              삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>취소</Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(schedule.id)
                setDeleteOpen(false)
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
