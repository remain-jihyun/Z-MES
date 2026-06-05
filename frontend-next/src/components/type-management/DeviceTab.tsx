"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Plus, Cpu, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// ── 임시 데이터 타입 ──────────────────────────────────────

type DeviceProcess = { processId: string; processName: string; spaceName: string }

type Device = {
  id: string
  name: string
  serialNo: string
  spaceName: string   // 디바이스가 속한 공간 (공정 공간과 일치해야 간반 생성)
  processes: DeviceProcess[]
  createdAt: string
}

// ── 임시 공간 목록 ─────────────────────────────────────────

const SPACE_OPTIONS = ["불출실", "전처리실", "조리실", "냉각실", "내포장실", "외포장실"]

// ── 공간별 공정 목록 (공간-공정 매핑) ─────────────────────

const PROCESS_BY_SPACE: Record<string, { id: string; name: string }[]> = {
  불출실:   [{ id:"prc-029", name:"자재 입고" }, { id:"prc-030", name:"자재 불출 - 전기호출" }, { id:"prc-031", name:"자재 불출 - 통합" }],
  전처리실: [{ id:"prc-001", name:"전전처리" }, { id:"prc-004", name:"전처리 - 야채류" }, { id:"prc-005", name:"전처리 - 수산/육류" }, { id:"prc-006", name:"전처리 - 검수" }, { id:"prc-002", name:"가열" }, { id:"prc-003", name:"소독/세정" }],
  조리실:   [{ id:"prc-007", name:"조리 - 무침" }, { id:"prc-008", name:"조리 - 전" }, { id:"prc-010", name:"조리 - 국솥" }, { id:"prc-011", name:"조리 - 인덕션" }, { id:"prc-012", name:"조리 - 튀김기" }, { id:"prc-013", name:"조리 - 오븐" }, { id:"prc-014", name:"조리 - 검수" }],
  냉각실:   [{ id:"prc-023", name:"방열" }, { id:"prc-024", name:"냉각" }],
  내포장실: [{ id:"prc-015", name:"내포장 - 소용량" }, { id:"prc-016", name:"내포장 - 대용량" }, { id:"prc-017", name:"내포장 - 멀티팩" }, { id:"prc-021", name:"중량선별기" }, { id:"prc-022", name:"금속검출기" }],
  외포장실: [{ id:"prc-025", name:"정리" }, { id:"prc-026", name:"피킹" }, { id:"prc-027", name:"패킹" }, { id:"prc-028", name:"출고" }],
}

// ── 초기 예시 데이터 ──────────────────────────────────────

const INITIAL_DEVICES: Device[] = [
  {
    id: "dev-001", name: "조리실 태블릿 A", serialNo: "TAB-2024-001", spaceName: "조리실", createdAt: "2026.05.10",
    processes: [
      { processId: "prc-010", processName: "조리 - 국솥",    spaceName: "조리실" },
      { processId: "prc-011", processName: "조리 - 인덕션", spaceName: "조리실" },
    ],
  },
  {
    id: "dev-002", name: "내포장 스캐너 B", serialNo: "SCN-2024-002", spaceName: "내포장실", createdAt: "2026.05.12",
    processes: [
      { processId: "prc-022", processName: "금속검출기", spaceName: "내포장실" },
    ],
  },
  {
    id: "dev-003", name: "전처리 단말기 C", serialNo: "TAB-2024-003", spaceName: "전처리실", createdAt: "2026.05.15",
    processes: [],
  },
]

// ── 폼 다이얼로그 ─────────────────────────────────────────

interface DeviceFormDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem: Device | null
  onSubmit: (data: Omit<Device, "id" | "createdAt">) => void
}

function DeviceFormDialog({ open, onOpenChange, editItem, onSubmit }: DeviceFormDialogProps) {
  const [name, setName] = useState(editItem?.name ?? "")
  const [serialNo, setSerialNo] = useState(editItem?.serialNo ?? "")
  const [spaceName, setSpaceName] = useState(editItem?.spaceName ?? "")
  const [selectedProcessIds, setSelectedProcessIds] = useState<string[]>(
    editItem?.processes.map(p => p.processId) ?? []
  )

  const availableProcesses = PROCESS_BY_SPACE[spaceName] ?? []

  const handleSpaceChange = (v: string | null) => {
    setSpaceName(v ?? "")
    setSelectedProcessIds([])
  }

  const toggleProcess = (id: string) => {
    setSelectedProcessIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!name.trim() || !spaceName) return
    const processes: DeviceProcess[] = availableProcesses
      .filter(p => selectedProcessIds.includes(p.id))
      .map(p => ({ processId: p.id, processName: p.name, spaceName }))
    onSubmit({ name: name.trim(), serialNo: serialNo.trim(), spaceName, processes })
    onOpenChange(false)
  }

  // 다이얼로그 열릴 때 초기화
  const handleOpenChange = (v: boolean) => {
    if (v) {
      setName(editItem?.name ?? "")
      setSerialNo(editItem?.serialNo ?? "")
      setSpaceName(editItem?.spaceName ?? "")
      setSelectedProcessIds(editItem?.processes.map(p => p.processId) ?? [])
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>{editItem ? "디바이스 수정" : "디바이스 등록"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">디바이스명 *</Label>
            <Input placeholder="예: 조리실 태블릿 A" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">시리얼 번호</Label>
            <Input placeholder="예: TAB-2024-001" value={serialNo} onChange={e => setSerialNo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">공간 *</Label>
            <Select value={spaceName} onValueChange={handleSpaceChange}>
              <SelectTrigger>
                <SelectValue placeholder="공간 선택" />
              </SelectTrigger>
              <SelectContent>
                {SPACE_OPTIONS.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {spaceName && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">연결 공정</Label>
                <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-px rounded-full">
                  <Info className="size-2.5" />공간이 같아야 간반 생성
                </span>
              </div>
              <div className="rounded-md border divide-y max-h-48 overflow-y-auto">
                {availableProcesses.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-muted-foreground">해당 공간에 등록된 공정이 없습니다</p>
                ) : availableProcesses.map(proc => (
                  <label key={proc.id}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted/40 cursor-pointer">
                    <input type="checkbox" className="rounded" checked={selectedProcessIds.includes(proc.id)}
                      onChange={() => toggleProcess(proc.id)} />
                    <span className="text-sm">{proc.name}</span>
                    <Badge variant="secondary" className="text-[9px] ml-auto">간반생성</Badge>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>취소</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim() || !spaceName}>
            {editItem ? "수정" : "등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── 메인 탭 컴포넌트 ──────────────────────────────────────

export function DeviceTab() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState<Device | null>(null)

  const handleSubmit = (data: Omit<Device, "id" | "createdAt">) => {
    if (editItem) {
      setDevices(prev => prev.map(d => d.id === editItem.id ? { ...d, ...data } : d))
    } else {
      setDevices(prev => [...prev, { id: `dev-${Date.now()}`, createdAt: new Date().toLocaleDateString("ko"), ...data }])
    }
    setEditItem(null)
  }

  const handleDelete = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="mt-4 max-w-4xl">
      {/* 간반 규칙 안내 */}
      <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <Info className="size-4 text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-700">
          <span className="font-semibold">간반 생성 규칙</span>
          <span className="ml-2 text-blue-600">디바이스의 공간과 연결된 공정의 공간이 동일할 때 간반이 생성됩니다.</span>
          <p className="mt-0.5 text-xs text-blue-500">간반은 실무자의 작업 지시서로, 디바이스를 통해 현장에 전달됩니다.</p>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">디바이스 목록</h3>
          <Badge variant="secondary">{devices.length}건</Badge>
        </div>
        <Button size="sm" onClick={() => { setEditItem(null); setDialogOpen(true) }}>
          <Plus className="mr-1 h-4 w-4" />디바이스 등록
        </Button>
      </div>

      {devices.length === 0 ? (
        <div className="rounded-lg border py-12 text-center text-muted-foreground">
          <Cpu className="mx-auto mb-2 size-8 opacity-30" />
          <p className="text-sm">등록된 디바이스가 없습니다</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-44">디바이스명</TableHead>
                <TableHead className="w-32">시리얼 번호</TableHead>
                <TableHead className="w-24">공간</TableHead>
                <TableHead>연결 공정</TableHead>
                <TableHead className="w-24">등록일</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map(device => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Cpu className="size-3.5 text-muted-foreground" />
                      <span className="font-medium">{device.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-mono">
                    {device.serialNo || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{device.spaceName}</Badge>
                  </TableCell>
                  <TableCell>
                    {device.processes.length === 0 ? (
                      <span className="text-xs text-muted-foreground">연결된 공정 없음</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {device.processes.map(p => (
                          <span key={p.processId}
                            className={cn(
                              "inline-flex items-center gap-0.5 text-[10px] px-1.5 py-px rounded-full border font-medium",
                              p.spaceName === device.spaceName
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                            {p.processName}
                            {p.spaceName === device.spaceName && (
                              <span className="text-green-500">·간반</span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{device.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-7 w-7" />}>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditItem(device); setDialogOpen(true) }}>수정</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(device.id)}>삭제</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeviceFormDialog
        open={dialogOpen}
        onOpenChange={v => { setDialogOpen(v); if (!v) setEditItem(null) }}
        editItem={editItem}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
