"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ChevronDown, ChevronRight, Link2, Save, CheckCircle2, AlertCircle,
  Plus, X, Pencil, History, CornerUpLeft, Clock, Trash2, LayoutGrid, ZoomIn, ZoomOut, ArrowLeft,
  Bookmark, GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChangeLogBanner } from "@/components/ChangeLogBanner"

// ── 팔레트 ────────────────────────────────────────────────

type PaletteItem = { id: string; name: string; isCcp: boolean; isInspection: boolean; isCooling: boolean; special?: "start" | "end" }
type PaletteGroup = { id: string; label: string; spaceLabel: string; color: string; items: PaletteItem[] }

const PALETTE: PaletteGroup[] = [
  { id: "material",   label: "불출",       spaceLabel: "불출실",   color: "#f59e0b",
    items: [{ id:"prc-029", name:"자재 입고", isCcp:false, isInspection:true, isCooling:false },{ id:"prc-030", name:"자재 불출 - 전기호출", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-031", name:"자재 불출 - 통합", isCcp:false, isInspection:false, isCooling:false }] },
  { id: "preprocess", label: "전처리",     spaceLabel: "전처리실", color: "#f97316",
    items: [{ id:"prc-001", name:"전전처리", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-004", name:"전처리 - 야채류", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-005", name:"전처리 - 수산/육류", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-006", name:"전처리 - 검수", isCcp:false, isInspection:true, isCooling:false },{ id:"prc-002", name:"가열", isCcp:true, isInspection:false, isCooling:false },{ id:"prc-003", name:"소독/세정", isCcp:true, isInspection:false, isCooling:true }] },
  { id: "cooking",    label: "조리",       spaceLabel: "조리실",   color: "#ef4444",
    items: [{ id:"prc-007", name:"조리 - 무침", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-008", name:"조리 - 전", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-010", name:"조리 - 국솥", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-011", name:"조리 - 인덕션", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-012", name:"조리 - 튀김기", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-013", name:"조리 - 오븐", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-014", name:"조리 - 검수", isCcp:false, isInspection:true, isCooling:false }] },
  { id: "cooling",    label: "냉각/방열",  spaceLabel: "냉각실",   color: "#3b82f6",
    items: [{ id:"prc-023", name:"방열", isCcp:false, isInspection:false, isCooling:true },{ id:"prc-024", name:"냉각", isCcp:false, isInspection:false, isCooling:true }] },
  { id: "inner",      label: "내포장",     spaceLabel: "내포장실", color: "#10b981",
    items: [{ id:"prc-015", name:"내포장 - 소용량", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-016", name:"내포장 - 대용량", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-017", name:"내포장 - 멀티팩", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-032", name:"실링 - 소용량", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-021", name:"중량선별기", isCcp:false, isInspection:true, isCooling:false },{ id:"prc-022", name:"금속검출기", isCcp:true, isInspection:false, isCooling:false }] },
  { id: "outer",      label: "외포장/출고", spaceLabel: "외포장실", color: "#8b5cf6",
    items: [{ id:"prc-025", name:"정리", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-026", name:"피킹", isCcp:false, isInspection:true, isCooling:false },{ id:"prc-027", name:"패킹", isCcp:false, isInspection:false, isCooling:false },{ id:"prc-028", name:"출고", isCcp:false, isInspection:false, isCooling:false }] },
]

// ── 타입 ──────────────────────────────────────────────────

type SavedProcess = { id: string; name: string; nodes: CanvasNode[]; edges: Edge[]; createdAt: string }

type CanvasNode = {
  id: string; paletteId: string; groupId: string; groupColor: string; spaceLabel: string
  label: string; isCcp: boolean; isInspection: boolean; isCooling: boolean; createKanban: boolean
  special?: "start" | "end"; x: number; y: number
}
type Edge = { id: string; from: string; to: string }
type HistoryEntry = { id: string; timestamp: string; user: string; desc: string; snapshot: { nodes: CanvasNode[]; edges: Edge[] } }
type BopTemplate = { id: string; name: string; nodes: CanvasNode[]; edges: Edge[]; history: HistoryEntry[]; createdAt: string }

// ── 유틸 ──────────────────────────────────────────────────

let _uid = 400
const uid = () => `n${_uid++}`
const euid = () => `e${_uid++}`
const huid = () => `h${_uid++}`

function nowStr() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function bezierPath(fx: number, fy: number, tx: number, ty: number) {
  const dx = Math.max(60, Math.abs(tx - fx) * 0.4)
  return `M${fx},${fy} C${fx+dx},${fy} ${tx-dx},${ty} ${tx},${ty}`
}

const NODE_W = 180; const NODE_H = 68
const SNODE_W = 80; const SNODE_H = 40
const CONTAINER_PAD = 24
const CONTAINER_LABEL_H = 28

function nw(n: CanvasNode) { return n.special ? SNODE_W : NODE_W }
function nh(n: CanvasNode) { return n.special ? SNODE_H : NODE_H }

// ── 기본 데이터 ────────────────────────────────────────────

const DAK: BopTemplate = {
  id: "dak", name: "닭갈비", createdAt: "2026.06.03",
  nodes: [
    { id:"s1", paletteId:"sp-start", groupId:"sp", groupColor:"#22c55e", spaceLabel:"", label:"시작", isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"start", x:60,  y:300 },
    { id:"n1", paletteId:"prc-029", groupId:"material",   groupColor:"#f59e0b", spaceLabel:"불출실",   label:"자재 입고",        isCcp:false, isInspection:true,  isCooling:false, createKanban:true, x:244,  y:286 },
    { id:"n2", paletteId:"prc-001", groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실", label:"전전처리",          isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:552,  y:240 },
    { id:"n3", paletteId:"prc-005", groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실", label:"전처리 - 수산/육류",isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:552,  y:332 },
    { id:"n4", paletteId:"prc-010", groupId:"cooking",    groupColor:"#ef4444", spaceLabel:"조리실",   label:"조리 - 국솥",       isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:860,  y:286 },
    { id:"n5", paletteId:"prc-024", groupId:"cooling",    groupColor:"#3b82f6", spaceLabel:"냉각실",   label:"냉각",             isCcp:false, isInspection:false, isCooling:true,  createKanban:true, x:1168, y:286 },
    { id:"n6", paletteId:"prc-015", groupId:"inner",      groupColor:"#10b981", spaceLabel:"내포장실", label:"내포장 - 소용량",   isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:1476, y:240 },
    { id:"n7", paletteId:"prc-022", groupId:"inner",      groupColor:"#10b981", spaceLabel:"내포장실", label:"금속검출기",         isCcp:true,  isInspection:false, isCooling:false, createKanban:true, x:1476, y:332 },
    { id:"n8", paletteId:"prc-027", groupId:"outer",      groupColor:"#8b5cf6", spaceLabel:"외포장실", label:"패킹",             isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:1784, y:286 },
    { id:"e1", paletteId:"sp-end",  groupId:"sp",         groupColor:"#ef4444", spaceLabel:"",        label:"끝",               isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"end", x:2068, y:300 },
  ],
  edges: [
    { id:"e0", from:"s1", to:"n1" },{ id:"e1", from:"n1", to:"n2" },{ id:"e2", from:"n1", to:"n3" },
    { id:"e3", from:"n2", to:"n4" },{ id:"e4", from:"n3", to:"n4" },{ id:"e5", from:"n4", to:"n5" },
    { id:"e6", from:"n5", to:"n7" },{ id:"e7", from:"n6", to:"n7" },{ id:"e8", from:"n7", to:"n8" },
    { id:"e9", from:"n8", to:"e1" },
  ],
  history: [
    { id:"h1", timestamp:"2026.06.03 09:12", user:"박종철", desc:"초기 공정 등록", snapshot:{ nodes:[], edges:[] } },
    { id:"h2", timestamp:"2026.06.03 14:38", user:"이지현", desc:"금속검출기 추가 및 내포장 연결 수정", snapshot:{ nodes:[], edges:[] } },
    { id:"h3", timestamp:"2026.06.04 10:05", user:"이지현", desc:"시작/끝 노드 추가", snapshot:{ nodes:[], edges:[] } },
  ],
}

// ── 예시 저장 공정 ─────────────────────────────────────────

const INITIAL_SAVED_PROCESSES: SavedProcess[] = [
  {
    id: "saved-001", name: "불출·전처리 공정", createdAt: "2026.06.01",
    nodes: [
      { id:"s01-s",  paletteId:"sp-start",  groupId:"sp",         groupColor:"#22c55e", spaceLabel:"",      label:"시작",              isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"start", x:60,  y:300 },
      { id:"s01-n1", paletteId:"prc-029",   groupId:"material",   groupColor:"#f59e0b", spaceLabel:"불출실", label:"자재 입고",          isCcp:false, isInspection:true,  isCooling:false, createKanban:true,  x:244, y:286 },
      { id:"s01-n2", paletteId:"prc-004",   groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실",label:"전처리 - 야채류",    isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:552, y:194 },
      { id:"s01-n3", paletteId:"prc-005",   groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실",label:"전처리 - 수산/육류", isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:552, y:286 },
      { id:"s01-n4", paletteId:"prc-006",   groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실",label:"전처리 - 검수",      isCcp:false, isInspection:true,  isCooling:false, createKanban:true,  x:552, y:378 },
      { id:"s01-e",  paletteId:"sp-end",    groupId:"sp",         groupColor:"#ef4444", spaceLabel:"",      label:"끝",                isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"end",   x:836, y:300 },
    ],
    edges: [
      { id:"s01-e0", from:"s01-s",  to:"s01-n1" },
      { id:"s01-e1", from:"s01-n1", to:"s01-n2" }, { id:"s01-e2", from:"s01-n1", to:"s01-n3" }, { id:"s01-e3", from:"s01-n1", to:"s01-n4" },
      { id:"s01-e4", from:"s01-n2", to:"s01-e"  }, { id:"s01-e5", from:"s01-n3", to:"s01-e"  }, { id:"s01-e6", from:"s01-n4", to:"s01-e"  },
    ],
  },
  {
    id: "saved-002", name: "조리·냉각 공정", createdAt: "2026.06.02",
    nodes: [
      { id:"s02-s",  paletteId:"sp-start",  groupId:"sp",      groupColor:"#22c55e", spaceLabel:"",    label:"시작",       isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"start", x:60,  y:300 },
      { id:"s02-n1", paletteId:"prc-010",   groupId:"cooking", groupColor:"#ef4444", spaceLabel:"조리실",label:"조리 - 국솥", isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:244, y:240 },
      { id:"s02-n2", paletteId:"prc-014",   groupId:"cooking", groupColor:"#ef4444", spaceLabel:"조리실",label:"조리 - 검수", isCcp:false, isInspection:true,  isCooling:false, createKanban:true,  x:244, y:332 },
      { id:"s02-n3", paletteId:"prc-024",   groupId:"cooling", groupColor:"#3b82f6", spaceLabel:"냉각실",label:"냉각",       isCcp:false, isInspection:false, isCooling:true,  createKanban:true,  x:552, y:240 },
      { id:"s02-n4", paletteId:"prc-023",   groupId:"cooling", groupColor:"#3b82f6", spaceLabel:"냉각실",label:"방열",       isCcp:false, isInspection:false, isCooling:true,  createKanban:true,  x:552, y:332 },
      { id:"s02-e",  paletteId:"sp-end",    groupId:"sp",      groupColor:"#ef4444", spaceLabel:"",    label:"끝",         isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"end",   x:836, y:300 },
    ],
    edges: [
      { id:"s02-e0", from:"s02-s",  to:"s02-n1" }, { id:"s02-e1", from:"s02-s",  to:"s02-n2" },
      { id:"s02-e2", from:"s02-n1", to:"s02-n3" }, { id:"s02-e3", from:"s02-n2", to:"s02-n4" },
      { id:"s02-e4", from:"s02-n3", to:"s02-e"  }, { id:"s02-e5", from:"s02-n4", to:"s02-e"  },
    ],
  },
  {
    id: "saved-003", name: "내포장·출고 공정", createdAt: "2026.06.03",
    nodes: [
      { id:"s03-s",  paletteId:"sp-start",  groupId:"sp",    groupColor:"#22c55e", spaceLabel:"",      label:"시작",           isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"start", x:60,   y:300 },
      { id:"s03-n1", paletteId:"prc-015",   groupId:"inner", groupColor:"#10b981", spaceLabel:"내포장실",label:"내포장 - 소용량", isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:244,  y:196 },
      { id:"s03-n2", paletteId:"prc-016",   groupId:"inner", groupColor:"#10b981", spaceLabel:"내포장실",label:"내포장 - 대용량", isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:244,  y:288 },
      { id:"s03-n3", paletteId:"prc-022",   groupId:"inner", groupColor:"#10b981", spaceLabel:"내포장실",label:"금속검출기",      isCcp:true,  isInspection:false, isCooling:false, createKanban:true,  x:244,  y:380 },
      { id:"s03-n4", paletteId:"prc-026",   groupId:"outer", groupColor:"#8b5cf6", spaceLabel:"외포장실",label:"피킹",           isCcp:false, isInspection:true,  isCooling:false, createKanban:true,  x:552,  y:240 },
      { id:"s03-n5", paletteId:"prc-027",   groupId:"outer", groupColor:"#8b5cf6", spaceLabel:"외포장실",label:"패킹",           isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:552,  y:332 },
      { id:"s03-e",  paletteId:"sp-end",    groupId:"sp",    groupColor:"#ef4444", spaceLabel:"",      label:"끝",             isCcp:false, isInspection:false, isCooling:false, createKanban:false, special:"end",   x:836,  y:300 },
    ],
    edges: [
      { id:"s03-e0", from:"s03-s",  to:"s03-n1" }, { id:"s03-e1", from:"s03-s",  to:"s03-n2" }, { id:"s03-e2", from:"s03-s",  to:"s03-n3" },
      { id:"s03-e3", from:"s03-n1", to:"s03-n4" }, { id:"s03-e4", from:"s03-n2", to:"s03-n4" }, { id:"s03-e5", from:"s03-n3", to:"s03-n5" },
      { id:"s03-e6", from:"s03-n4", to:"s03-e"  }, { id:"s03-e7", from:"s03-n5", to:"s03-e"  },
    ],
  },
]

// ── 메인 ──────────────────────────────────────────────────

export default function BopPage() {
  const [templates, setTemplates] = useState<BopTemplate[]>([DAK])
  const [activeId, setActiveId] = useState<string | null>("dak")
  const [isEditing, setIsEditing] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(Object.fromEntries(PALETTE.map(g => [g.id, true])))

  // 편집 취소용 스냅샷
  const cancelSnapshot = useRef<{ nodes: CanvasNode[]; edges: Edge[] } | null>(null)

  // 신규 생성 다이얼로그
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const [savedProcesses, setSavedProcesses] = useState<SavedProcess[]>(INITIAL_SAVED_PROCESSES)
  const [savedProcessOpen, setSavedProcessOpen] = useState(false)
  const [savedProcessName, setSavedProcessName] = useState("")
  const [openSavedSection, setOpenSavedSection] = useState(true)

  // 삭제 확인 다이얼로그
  const [deleteOpen, setDeleteOpen] = useState(false)

  const active = templates.find(t => t.id === activeId) ?? null
  const nodes = active?.nodes ?? []
  const edges = active?.edges ?? []
  const history = active?.history ?? []

  // 템플릿 패치
  const patchActive = useCallback((patch: Partial<BopTemplate>, histDesc?: string) => {
    if (!activeId) return
    setTemplates(prev => prev.map(t => {
      if (t.id !== activeId) return t
      const next = { ...t, ...patch }
      if (histDesc) {
        const entry: HistoryEntry = { id: huid(), timestamp: nowStr(), user: "이지현", desc: histDesc, snapshot: { nodes: t.nodes, edges: t.edges } }
        next.history = [entry, ...t.history]
      }
      return next
    }))
    setIsDirty(true)
  }, [activeId])

  // 드래그 상태
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // 연결 상태
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [paletteTab, setPaletteTab] = useState<"single" | "saved">("single")

  const [checkResult, setCheckResult] = useState<{ ok: boolean; msg: string; errorNodeIds: Set<string> } | null>(null)
  const [showHistory, setShowHistory] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [savedToast, setSavedToast] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 })
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 })

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setScrollPos({ left: el.scrollLeft, top: el.scrollTop })
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setViewportSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const toCanvas = useCallback((cx: number, cy: number) => {
    const r = canvasRef.current?.getBoundingClientRect()
    return r ? { x: (cx - r.left) / zoom, y: (cy - r.top) / zoom } : { x: 0, y: 0 }
  }, [zoom])

  const onCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = toCanvas(e.clientX, e.clientY)
    setMousePos(pos)
    if (draggingId && isEditing) {
      const nx = Math.max(0, pos.x - dragOffset.current.x)
      const ny = Math.max(0, pos.y - dragOffset.current.y)
      patchActive({ nodes: nodes.map(n => n.id === draggingId ? { ...n, x: nx, y: ny } : n) })
    }
  }, [draggingId, isEditing, nodes, patchActive, toCanvas])

  const onCanvasMouseUp = useCallback(() => setDraggingId(null), [])

  const onCanvasClick = useCallback(() => {
    if (connectingFrom) { setConnectingFrom(null); return }
    setSelectedId(null)
  }, [connectingFrom])

  const onNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (!isEditing) return
    e.stopPropagation()
    if (connectingFrom) return
    const pos = toCanvas(e.clientX, e.clientY)
    const node = nodes.find(n => n.id === nodeId)!
    dragOffset.current = { x: pos.x - node.x, y: pos.y - node.y }
    setDraggingId(nodeId)
    setSelectedId(nodeId)
  }, [isEditing, connectingFrom, nodes, toCanvas])

  const onNodeClick = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    if (!isEditing) { setSelectedId(null); return }
    if (connectingFrom) {
      if (connectingFrom !== nodeId && !edges.some(ed => ed.from === connectingFrom && ed.to === nodeId)) {
        const from = nodes.find(n => n.id === connectingFrom)
        const to = nodes.find(n => n.id === nodeId)
        patchActive({ edges: [...edges, { id: euid(), from: connectingFrom, to: nodeId }] }, `연결: ${from?.label} → ${to?.label}`)
      }
      setConnectingFrom(null); return
    }
    setSelectedId(nodeId)
  }, [isEditing, connectingFrom, edges, nodes, patchActive])

  const onOutputPort = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    if (!isEditing) return
    setConnectingFrom(prev => prev === nodeId ? null : nodeId)
    setSelectedId(nodeId)
  }, [isEditing])

  const deleteNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    patchActive({ nodes: nodes.filter(n => n.id !== nodeId), edges: edges.filter(e => e.from !== nodeId && e.to !== nodeId) }, `노드 삭제: ${node?.label}`)
    if (selectedId === nodeId) setSelectedId(null)
    if (connectingFrom === nodeId) setConnectingFrom(null)
  }, [nodes, edges, patchActive, selectedId, connectingFrom])

  const deleteEdge = useCallback((edgeId: string) => {
    const ed = edges.find(e => e.id === edgeId)
    const from = nodes.find(n => n.id === ed?.from)
    const to = nodes.find(n => n.id === ed?.to)
    patchActive({ edges: edges.filter(e => e.id !== edgeId) }, `연결 삭제: ${from?.label} → ${to?.label}`)
  }, [edges, nodes, patchActive])

  const onPaletteDragStart = useCallback((e: React.DragEvent, groupId: string, color: string, spaceLabel: string, item: PaletteItem) => {
    e.dataTransfer.setData("bop/item", JSON.stringify({ groupId, color, spaceLabel, item }))
  }, [])

  const onCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const pos = toCanvas(e.clientX, e.clientY)

    // 저장된 공정 드롭
    const savedRaw = e.dataTransfer.getData("bop/saved-process")
    if (savedRaw) {
      const sp = JSON.parse(savedRaw) as SavedProcess
      const minX = Math.min(...sp.nodes.map(n => n.x))
      const minY = Math.min(...sp.nodes.map(n => n.y))
      const idMap: Record<string, string> = {}
      sp.nodes.forEach(n => { idMap[n.id] = uid() })
      const newNodes = sp.nodes.map(n => ({ ...n, id: idMap[n.id], x: Math.max(0, pos.x + (n.x - minX)), y: Math.max(0, pos.y + (n.y - minY)) }))
      const newEdges = sp.edges.map(ed => ({ id: euid(), from: idMap[ed.from] ?? ed.from, to: idMap[ed.to] ?? ed.to }))
      patchActive({ nodes: [...nodes, ...newNodes], edges: [...edges, ...newEdges] }, `저장된 공정 배치: ${sp.name}`)
      setCheckResult(null)
      return
    }

    // 낱개 공정 드롭
    const raw = e.dataTransfer.getData("bop/item")
    if (!raw) return
    const { groupId, color, spaceLabel, item } = JSON.parse(raw) as { groupId: string; color: string; spaceLabel: string; item: PaletteItem }
    const newNode: CanvasNode = {
      id: uid(), paletteId: item.id, groupId, groupColor: color, spaceLabel,
      label: item.name, isCcp: item.isCcp, isInspection: item.isInspection,
      isCooling: item.isCooling, createKanban: !item.special, special: item.special,
      x: Math.max(0, pos.x - nw({ special: item.special } as CanvasNode) / 2),
      y: Math.max(0, pos.y - nh({ special: item.special } as CanvasNode) / 2),
    }
    patchActive({ nodes: [...nodes, newNode] }, `노드 추가: ${item.name}`)
    setCheckResult(null)
  }, [nodes, edges, patchActive, toCanvas])

  const restoreHistory = useCallback((entry: HistoryEntry) => {
    patchActive({ nodes: entry.snapshot.nodes, edges: entry.snapshot.edges }, `복구: ${entry.desc}`)
    setSelectedId(null); setConnectingFrom(null); setCheckResult(null)
  }, [patchActive])

  const checkConnections = useCallback(() => {
    const errorIds = new Set<string>()
    const msgs: string[] = []

    if (nodes.length === 0) {
      setCheckResult({ ok: false, msg: "배치된 공정이 없습니다.", errorNodeIds: errorIds }); return
    }

    const startNodes = nodes.filter(n => n.special === "start")
    const endNodes   = nodes.filter(n => n.special === "end")

    if (startNodes.length === 0) { msgs.push("시작 노드가 없습니다"); nodes.forEach(n => errorIds.add(n.id)) }
    if (endNodes.length   === 0) { msgs.push("끝 노드가 없습니다");   nodes.forEach(n => errorIds.add(n.id)) }

    // 순방향 BFS: 시작 → 도달 가능
    if (startNodes.length > 0) {
      const reached = new Set<string>()
      const q = startNodes.map(n => n.id)
      q.forEach(id => reached.add(id))
      while (q.length > 0) {
        const cur = q.shift()!
        edges.filter(e => e.from === cur && !reached.has(e.to)).forEach(e => { reached.add(e.to); q.push(e.to) })
      }
      nodes.filter(n => !reached.has(n.id)).forEach(n => errorIds.add(n.id))
    }

    // 역방향 BFS: 끝 ← 도달 가능
    if (endNodes.length > 0) {
      const reached = new Set<string>()
      const q = endNodes.map(n => n.id)
      q.forEach(id => reached.add(id))
      while (q.length > 0) {
        const cur = q.shift()!
        edges.filter(e => e.to === cur && !reached.has(e.from)).forEach(e => { reached.add(e.from); q.push(e.from) })
      }
      nodes.filter(n => !reached.has(n.id)).forEach(n => errorIds.add(n.id))
    }

    const problemNodes = nodes.filter(n => errorIds.has(n.id) && !n.special)
    if (problemNodes.length > 0 && msgs.length === 0)
      msgs.push(`연결이 끊긴 공정: ${problemNodes.map(n => n.label).join(", ")}`)

    if (msgs.length === 0) {
      setCheckResult({ ok: true, msg: "정상", errorNodeIds: new Set() })
    } else {
      setCheckResult({ ok: false, msg: msgs.join(" · "), errorNodeIds: errorIds })
    }
  }, [nodes, edges])

  const handleEdit = useCallback(() => {
    cancelSnapshot.current = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }
    setIsEditing(true); setIsDirty(false); setShowHistory(false)
  }, [nodes, edges])

  const handleCancel = useCallback(() => {
    if (isCreating) {
      setTemplates(prev => prev.filter(t => t.id !== activeId))
      const remaining = templates.filter(t => t.id !== activeId)
      setActiveId(remaining.length > 0 ? remaining[0].id : null)
      setIsCreating(false)
    } else if (cancelSnapshot.current) {
      patchActive({ nodes: cancelSnapshot.current.nodes, edges: cancelSnapshot.current.edges })
      setIsDirty(false)
    }
    setIsEditing(false); setSelectedId(null); setConnectingFrom(null); setCheckResult(null)
    setShowHistory(true)
  }, [isCreating, activeId, templates, patchActive])

  const handleSave = useCallback(() => {
    setIsEditing(false); setIsDirty(false); setShowHistory(true); setIsCreating(false)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
  }, [])

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return
    const newId = `bop-${Date.now()}`
    const newTemplate: BopTemplate = { id: newId, name: newName.trim(), nodes: [], edges: [], history: [], createdAt: nowStr().slice(0, 10) }
    setTemplates(prev => [...prev, newTemplate])
    setActiveId(newId)
    setIsEditing(true); setIsDirty(false); setShowHistory(false); setIsCreating(true)
    setCreateOpen(false); setNewName("")
  }, [newName])

  const handleDelete = useCallback(() => {
    setTemplates(prev => prev.filter(t => t.id !== activeId))
    const remaining = templates.filter(t => t.id !== activeId)
    setActiveId(remaining.length > 0 ? remaining[0].id : null)
    setDeleteOpen(false); setIsEditing(false); setIsDirty(false)
  }, [activeId, templates])

  const handleSelectChange = useCallback((val: string | null) => {
    if (!val || val === activeId) return
    setActiveId(val); setIsEditing(false); setIsDirty(false)
    setSelectedId(null); setConnectingFrom(null); setCheckResult(null); setShowHistory(true)
  }, [activeId])

  const handleAutoLayout = useCallback(() => {
    const GAP_BETWEEN_GROUPS = 80
    const GAP_BETWEEN_NODES = 24
    const CANVAS_CENTER_Y = 320

    const startNodes = nodes.filter(n => n.special === 'start')
    const endNodes = nodes.filter(n => n.special === 'end')
    const regularNodes = nodes.filter(n => !n.special)

    const paletteOrder = PALETTE.map(g => g.id)
    const groupMap: Record<string, CanvasNode[]> = {}
    regularNodes.forEach(n => {
      if (!groupMap[n.groupId]) groupMap[n.groupId] = []
      groupMap[n.groupId].push(n)
    })
    const orderedGroupIds = paletteOrder.filter(id => groupMap[id])

    const newPos: Record<string, { x: number; y: number }> = {}
    let currentX = 60

    startNodes.forEach(n => {
      newPos[n.id] = { x: currentX, y: CANVAS_CENTER_Y - SNODE_H / 2 }
    })
    if (startNodes.length > 0) currentX += SNODE_W + GAP_BETWEEN_GROUPS

    orderedGroupIds.forEach(groupId => {
      const gNodes = groupMap[groupId]
      const totalH = gNodes.length * NODE_H + (gNodes.length - 1) * GAP_BETWEEN_NODES
      const containerTopY = CANVAS_CENTER_Y - CONTAINER_LABEL_H - CONTAINER_PAD - totalH / 2
      gNodes.forEach((n, i) => {
        newPos[n.id] = {
          x: currentX + CONTAINER_PAD,
          y: containerTopY + CONTAINER_LABEL_H + CONTAINER_PAD + i * (NODE_H + GAP_BETWEEN_NODES),
        }
      })
      currentX += NODE_W + CONTAINER_PAD * 2 + GAP_BETWEEN_GROUPS
    })

    endNodes.forEach(n => {
      newPos[n.id] = { x: currentX, y: CANVAS_CENTER_Y - SNODE_H / 2 }
    })

    patchActive({ nodes: nodes.map(n => ({ ...n, ...(newPos[n.id] ?? {}) })) }, '자동 배치')
  }, [nodes, patchActive])

  const handleSaveProcess = useCallback(() => {
    if (!savedProcessName.trim() || nodes.length === 0) return
    const sp: SavedProcess = {
      id: `sp-${Date.now()}`,
      name: savedProcessName.trim(),
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      createdAt: nowStr().slice(0, 10),
    }
    setSavedProcesses(prev => [...prev, sp])
    setSavedProcessOpen(false)
    setSavedProcessName("")
  }, [savedProcessName, nodes, edges])

  const groupContainers = useMemo(() => {
    const groups: Record<string, { spaceLabel: string; groupColor: string; nodes: CanvasNode[] }> = {}
    nodes.forEach(n => {
      if (n.special || !n.spaceLabel) return
      if (!groups[n.groupId]) groups[n.groupId] = { spaceLabel: n.spaceLabel, groupColor: n.groupColor, nodes: [] }
      groups[n.groupId].nodes.push(n)
    })
    return Object.values(groups).map(g => {
      const minX = Math.min(...g.nodes.map(n => n.x))
      const minY = Math.min(...g.nodes.map(n => n.y))
      const maxX = Math.max(...g.nodes.map(n => n.x + NODE_W))
      const maxY = Math.max(...g.nodes.map(n => n.y + NODE_H))
      return {
        spaceLabel: g.spaceLabel,
        groupColor: g.groupColor,
        x: minX - CONTAINER_PAD,
        y: minY - CONTAINER_LABEL_H - CONTAINER_PAD,
        width: maxX - minX + CONTAINER_PAD * 2,
        height: maxY - minY + CONTAINER_LABEL_H + CONTAINER_PAD * 2,
      }
    })
  }, [nodes])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConnectingFrom(null)
      if (e.key === "Delete" && selectedId && isEditing) deleteNode(selectedId)
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [selectedId, deleteNode, isEditing])

  // 연결 미리보기
  const fromNode = connectingFrom ? nodes.find(n => n.id === connectingFrom) : null
  const fromX = fromNode ? fromNode.x + nw(fromNode) : 0
  const fromY = fromNode ? fromNode.y + nh(fromNode) / 2 : 0

  const allW = nodes.reduce((m, n) => Math.max(m, n.x + nw(n) + 80), 900)
  const allH = nodes.reduce((m, n) => Math.max(m, n.y + nh(n) + 80), 500)

  const MINIMAP_W = 180
  const MINIMAP_H = 100
  const canvasW = Math.max(allW, 900)
  const canvasH = Math.max(allH, 500)
  const mmScale = Math.min(MINIMAP_W / canvasW, MINIMAP_H / canvasH)
  const mmActualW = canvasW * mmScale
  const mmActualH = canvasH * mmScale

  const ACTIVE_NAME = active?.name ?? ""

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <ChangeLogBanner pageHref="/master/bop" />
      {/* 저장 토스트 */}
      <div className={cn(
        "fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-medium shadow-lg transition-all duration-300",
        savedToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      )}>
        <CheckCircle2 className="size-4 shrink-0" />
        저장되었습니다
      </div>

      {/* 상단 바 */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b shrink-0">
        {isEditing && isCreating ? (
          <>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={handleCancel}>
              <ArrowLeft className="size-4" />뒤로가기
            </button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-base font-semibold">{active?.name}</h1>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">기초정보</p>
              <h1 className="text-base font-semibold leading-none mt-0.5">BOP</h1>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {checkResult && (
            <div className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border max-w-72 truncate",
              checkResult.ok ? "border-green-200 bg-green-50 text-green-700" : "border-destructive/30 bg-destructive/5 text-destructive")}>
              {checkResult.ok ? <CheckCircle2 className="size-3.5 shrink-0" /> : <AlertCircle className="size-3.5 shrink-0" />}
              <span className="truncate">{checkResult.msg}</span>
              <button onClick={() => setCheckResult(null)}><X className="size-3 ml-1 opacity-60 hover:opacity-100" /></button>
            </div>
          )}

          {active && !isEditing && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={() => setShowHistory(v => !v)}>
                <History className="size-3.5" />{showHistory ? "이력 닫기" : "수정 이력"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-3.5" />삭제
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={handleEdit}>
                <Pencil className="size-3.5" />편집
              </Button>
            </>
          )}

          {isEditing && (
            <>
              <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={handleAutoLayout} disabled={nodes.length === 0}>
                <LayoutGrid className="size-3.5" />자동 배치
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={checkConnections}>
                <Link2 className="size-3.5" />연결 확인
              </Button>
              <Button variant="outline" size="sm" className="h-8" onClick={handleCancel}>취소</Button>
              <Button size="sm" className="gap-1.5 h-8" onClick={handleSave} disabled={!isDirty}>
                <Save className="size-3.5" />저장
              </Button>
            </>
          )}

        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 BOP 목록 (뷰 모드) */}
        {!isEditing && (
          <aside className="w-52 shrink-0 border-r bg-muted/20 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="text-xs font-medium text-muted-foreground">BOP 유형</span>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setCreateOpen(true)}>
                <Plus className="size-3" />생성
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {templates.length === 0 ? (
                <p className="px-3 py-4 text-xs text-muted-foreground text-center">등록된 BOP가 없습니다</p>
              ) : (
                templates.map(t => (
                  <button key={t.id}
                    className={cn("w-full text-left px-3 py-2.5 text-sm transition-colors",
                      t.id === activeId
                        ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                        : "text-foreground hover:bg-muted/50")}
                    onClick={() => handleSelectChange(t.id)}>
                    <div className="truncate">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{t.createdAt}</div>
                  </button>
                ))
              )}
            </div>
          </aside>
        )}

        {/* 좌측 팔레트 (편집 모드) */}
        {isEditing && (
          <aside className="w-52 shrink-0 border-r bg-muted/20 flex flex-col overflow-hidden">
            {/* 탭 헤더 */}
            <div className="flex border-b shrink-0">
              <button
                className={cn("flex-1 py-2 text-xs font-medium transition-colors border-b-2",
                  paletteTab === "single" ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground")}
                onClick={() => setPaletteTab("single")}>
                공정
              </button>
              <button
                className={cn("flex-1 py-2 text-xs font-medium transition-colors border-b-2 flex items-center justify-center gap-1",
                  paletteTab === "saved" ? "text-foreground border-primary" : "text-muted-foreground border-transparent hover:text-foreground")}
                onClick={() => setPaletteTab("saved")}>
                저장된 공정
                {savedProcesses.length > 0 && (
                  <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{savedProcesses.length}</Badge>
                )}
              </button>
            </div>

            {/* 낱개 탭 */}
            {paletteTab === "single" && (
              <div className="flex-1 overflow-y-auto">
                <div className="px-2 py-2 space-y-1.5">
                  {[
                    { id: "sp-start", name: "시작", special: "start" as const, isCcp: false, isInspection: false, isCooling: false },
                    { id: "sp-end",   name: "끝",   special: "end"   as const, isCcp: false, isInspection: false, isCooling: false },
                  ].map(item => (
                    <div key={item.id} draggable
                      onDragStart={e => onPaletteDragStart(e, "sp", item.special === "start" ? "#22c55e" : "#ef4444", "", item)}
                      className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-grab select-none",
                        "border-gray-700 bg-gray-900 text-white hover:bg-gray-800")}>
                      <span className="w-2 h-2 rounded-full bg-white" />
                      {item.name}
                    </div>
                  ))}
                </div>
                <Separator />
                {PALETTE.map(group => (
                  <div key={group.id}>
                    <button className="flex items-center gap-1.5 w-full px-3 py-1.5 text-xs font-medium hover:bg-muted/50"
                      onClick={() => setOpenGroups(p => ({ ...p, [group.id]: !p[group.id] }))}>
                      <span className="w-2 h-2 rounded-full" style={{ background: group.color }} />
                      {group.label}
                      {openGroups[group.id] ? <ChevronDown className="size-3 ml-auto text-muted-foreground" /> : <ChevronRight className="size-3 ml-auto text-muted-foreground" />}
                    </button>
                    {openGroups[group.id] && (
                      <div className="pb-1">
                        {group.items.map(item => (
                          <div key={item.id} draggable
                            onDragStart={e => onPaletteDragStart(e, group.id, group.color, group.spaceLabel, item)}
                            className="mx-2 mb-1 px-2.5 py-1.5 text-xs rounded-md border bg-background cursor-grab hover:bg-muted/50 hover:shadow-sm select-none">
                            <div className="font-medium text-foreground truncate">{item.name}</div>
                            {(item.isCcp || item.isInspection || item.isCooling) && (
                              <div className="flex gap-1 mt-0.5">
                                {item.isCcp && <span className="px-1 py-px rounded bg-red-100 text-red-600 text-[9px] font-medium">CCP</span>}
                                {item.isInspection && <span className="px-1 py-px rounded bg-amber-100 text-amber-600 text-[9px] font-medium">검수</span>}
                                {item.isCooling && <span className="px-1 py-px rounded bg-blue-100 text-blue-600 text-[9px] font-medium">냉각</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 저장된 공정 탭 */}
            {paletteTab === "saved" && (
              <div className="flex-1 overflow-y-auto">
                <div className="px-2 pt-2 pb-1">
                  <button
                    disabled={nodes.length === 0}
                    onClick={() => { setSavedProcessName(""); setSavedProcessOpen(true) }}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground border border-dashed rounded-md hover:bg-muted/40 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <Plus className="size-3" />현재 공정 저장
                  </button>
                </div>
                {savedProcesses.length === 0 ? (
                  <p className="text-center text-[10px] text-muted-foreground py-6">저장된 공정이 없습니다</p>
                ) : (
                  <div className="px-2 pb-2 space-y-1.5">
                    {savedProcesses.map(sp => {
                      const spaces = [...new Map(
                        sp.nodes.filter(n => !n.special && n.spaceLabel).map(n => [n.groupId, { label: n.spaceLabel, color: n.groupColor }])
                      ).values()]
                      const regularCount = sp.nodes.filter(n => !n.special).length
                      return (
                        <div key={sp.id} draggable
                          onDragStart={e => e.dataTransfer.setData("bop/saved-process", JSON.stringify(sp))}
                          className="px-2 py-2 rounded-md border bg-background cursor-grab hover:bg-muted/40 hover:shadow-sm select-none group">
                          <div className="flex items-start gap-1">
                            <GripVertical className="size-3 mt-0.5 shrink-0 text-muted-foreground/40" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-medium truncate">{sp.name}</span>
                                <button
                                  onClick={e => { e.stopPropagation(); setSavedProcesses(prev => prev.filter(x => x.id !== sp.id)) }}
                                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                                  <X className="size-3" />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-0.5 mt-1">
                                {spaces.map(g => (
                                  <span key={g.label} className="text-[9px] px-1.5 py-px rounded-full font-medium"
                                    style={{ background: `${g.color}1a`, color: g.color, border: `1px solid ${g.color}4d` }}>
                                    {g.label}
                                  </span>
                                ))}
                              </div>
                              <span className="text-[10px] text-muted-foreground mt-0.5 block">{regularCount}개 공정 · {sp.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* 캔버스 영역 */}
        <div className="relative flex-1 overflow-hidden">

          {/* 빈 상태 오버레이 (scroll 흐름 밖, drop 영역 보존) */}
          {!active && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#fafafa]"
              style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm font-medium">등록된 BOP가 없습니다</p>
                <p className="text-xs mt-1 mb-4">상단 Select 또는 버튼으로 새 BOP를 등록하세요</p>
                <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="size-3.5" />BOP 등록</Button>
              </div>
            </div>
          )}
          {active && nodes.length === 0 && isEditing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center text-muted-foreground">
                <div className="text-3xl mb-2">→</div>
                <p className="text-sm font-medium">좌측에서 공정을 드래그해 배치하세요</p>
              </div>
            </div>
          )}

        <div ref={scrollRef} className="absolute inset-0 overflow-auto bg-[#fafafa]" style={{ backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          onScroll={onScroll}
          onWheel={e => {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault()
              setZoom(z => Math.min(2, Math.max(0.3, z - e.deltaY * 0.001)))
            }
          }}>

          {active && (
            <div style={{ width: canvasW * zoom, height: canvasH * zoom, minWidth: "100%", minHeight: "100%", position: "relative" }}>
            <div ref={canvasRef}
              className={cn("relative select-none", connectingFrom && "cursor-crosshair", draggingId && "cursor-grabbing")}
              style={{ width: canvasW, height: canvasH, transform: `scale(${zoom})`, transformOrigin: "0 0", position: "absolute", top: 0, left: 0 }}
              onMouseMove={onCanvasMouseMove} onMouseUp={onCanvasMouseUp}
              onClick={onCanvasClick}
              onDragOver={e => e.preventDefault()} onDrop={onCanvasDrop}>

              {/* 공정 장소 컨테이너 */}
              {groupContainers.map(gc => (
                <div key={gc.spaceLabel} className="absolute pointer-events-none"
                  style={{ left: gc.x, top: gc.y, width: gc.width, height: gc.height, zIndex: 2,
                    border: `1.5px dashed ${gc.groupColor}`, borderRadius: 12,
                    backgroundColor: `${gc.groupColor}0d` }}>
                  <span className="absolute flex items-center font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ fontSize: 11, top: -13, left: 12, whiteSpace: "nowrap",
                      color: gc.groupColor, backgroundColor: `${gc.groupColor}1a`,
                      border: `1px solid ${gc.groupColor}4d` }}>
                    {gc.spaceLabel}
                  </span>
                </div>
              ))}

              {/* SVG 연결선 */}
              <svg className="absolute inset-0 overflow-visible" style={{ zIndex: 5, pointerEvents: "none" }} width={Math.max(allW, 900)} height={Math.max(allH, 500)}>
                <defs>
                  <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <path d="M0,0L0,6L8,3z" fill="#94a3b8" />
                  </marker>
                  <marker id="arr-p" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <path d="M0,0L0,6L8,3z" fill="#6366f1" />
                  </marker>
                  <marker id="arr-err" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                    <path d="M0,0L0,6L8,3z" fill="#ef4444" />
                  </marker>
                </defs>
                {edges.map(ed => {
                  const fn = nodes.find(n => n.id === ed.from)
                  const tn = nodes.find(n => n.id === ed.to)
                  if (!fn || !tn) return null
                  const fx = fn.x + nw(fn), fy = fn.y + nh(fn) / 2
                  const tx = tn.x, ty = tn.y + nh(tn) / 2
                  const lx = (fx + tx) / 2, ly = (fy + ty) / 2
                  const d = bezierPath(fx, fy, tx, ty)
                  const isErrEdge = (checkResult?.errorNodeIds?.has(ed.from) || checkResult?.errorNodeIds?.has(ed.to)) ?? false
                  return (
                    <g key={ed.id}>
                      <path d={d} fill="none" stroke="transparent" strokeWidth={12}
                        style={{ pointerEvents: "stroke", cursor: isEditing ? "pointer" : "default" }}
                        onClick={e => { e.stopPropagation(); if (isEditing) deleteEdge(ed.id) }} />
                      <path d={d} fill="none" stroke={isErrEdge ? "#ef4444" : "#94a3b8"} strokeWidth={isErrEdge ? 2 : 1.5} markerEnd={isErrEdge ? "url(#arr-err)" : "url(#arr)"} />
                      {isEditing && (
                        <>
                          <circle cx={lx} cy={ly} r={7} fill="white" stroke="#e2e8f0" strokeWidth={1}
                            style={{ pointerEvents: "all", cursor: "pointer" }}
                            onClick={e => { e.stopPropagation(); deleteEdge(ed.id) }} />
                          <text x={lx} y={ly + 3.5} textAnchor="middle" fontSize={9} fill="#94a3b8" style={{ pointerEvents: "none" }}>✕</text>
                        </>
                      )}
                    </g>
                  )
                })}
                {connectingFrom && fromNode && (
                  <path d={bezierPath(fromX, fromY, mousePos.x, mousePos.y)}
                    fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#arr-p)" />
                )}
              </svg>

              {/* 노드들 */}
              {nodes.map(node => {
                const isSel = selectedId === node.id
                const isConnFrom = connectingFrom === node.id
                const isHovered = hoveredId === node.id
                const isConnTarget = !!connectingFrom && connectingFrom !== node.id && isHovered
                const isError = checkResult?.errorNodeIds?.has(node.id) ?? false
                const w = nw(node), h = nh(node)
                return (
                  <div key={node.id} className="absolute"
                    style={{ left: node.x, top: node.y, width: w, height: h, zIndex: isSel ? 30 : 20 }}
                    onMouseDown={e => onNodeMouseDown(e, node.id)}
                    onMouseEnter={() => { if (isEditing) setHoveredId(node.id) }}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={e => onNodeClick(e, node.id)}>

                    {/* 노드 본체 */}
                    <div className={cn(
                      "absolute inset-0 flex flex-col items-center justify-center transition-all duration-100",
                      node.special ? "rounded-full border-2 cursor-pointer" : "rounded-xl border bg-card shadow-sm cursor-pointer hover:shadow-md",
                      node.special === "start" && !isError && "border-gray-800 bg-gray-900",
                      node.special === "end"   && !isError && "border-gray-800 bg-gray-900",
                      !node.special && !isSel && !isConnFrom && !isError && "border-border",
                      !node.special && isSel && !isConnFrom && !isError && "border-primary ring-2 ring-primary/20",
                      isConnFrom && "border-indigo-500 ring-2 ring-indigo-200",
                      isConnTarget && "ring-2 ring-blue-400 ring-offset-1 border-blue-400",
                      isError && "border-red-500 ring-2 ring-red-300 bg-red-50/40",
                    )}>
                      {!node.special && (
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ background: node.groupColor }} />
                      )}
                      <span className={cn("text-sm font-semibold text-center px-3 leading-tight mt-1",
                        node.special ? "text-white" : "text-foreground")}>
                        {node.label}
                      </span>
                      {!node.special && !node.createKanban && (
                        <span className="px-1.5 py-px rounded-full bg-gray-100 text-gray-500 text-[8px] font-medium mt-0.5">간반 미생성</span>
                      )}
                      {!node.special && (node.isCcp || node.isInspection || node.isCooling) && (
                        <div className="flex gap-1 mt-1">
                          {node.isCcp && <span className="px-1.5 py-px rounded-full bg-red-100 text-red-600 text-[8px] font-semibold">CCP</span>}
                          {node.isInspection && <span className="px-1.5 py-px rounded-full bg-amber-100 text-amber-600 text-[8px] font-semibold">검수</span>}
                          {node.isCooling && <span className="px-1.5 py-px rounded-full bg-blue-100 text-blue-600 text-[8px] font-semibold">냉각</span>}
                        </div>
                      )}
                    </div>

                    {/* 연결 포트 (동그라미) - hover 또는 connecting 중 표시 */}
                    {isEditing && !connectingFrom && (isHovered || isConnFrom) && (
                      <button
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 -right-2.5 w-5 h-5 rounded-full border-2 border-white shadow-md z-40 transition-transform hover:scale-125",
                          isConnFrom ? "bg-indigo-500" : "bg-primary"
                        )}
                        onClick={e => onOutputPort(e, node.id)} />
                    )}
                    {isEditing && isConnFrom && (
                      <button
                        className="absolute top-1/2 -translate-y-1/2 -right-2.5 w-5 h-5 rounded-full border-2 border-white bg-indigo-500 shadow-md z-40"
                        onClick={e => onOutputPort(e, node.id)} />
                    )}

                    {/* 삭제 버튼 (선택된 노드만) */}
                    {isSel && isEditing && (
                      <button
                        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-background border border-border text-muted-foreground flex items-center justify-center z-40 hover:bg-destructive/10 hover:text-destructive shadow-sm"
                        onClick={e => { e.stopPropagation(); deleteNode(node.id) }}>
                        <X className="size-2.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            </div>
          )}
        </div>

        {/* 미니맵 (뷰 모드) */}
        {active && !isEditing && nodes.length > 0 && (
          <div className="absolute bottom-4 left-4 z-50 rounded-lg border border-border/60 bg-white/90 shadow-md overflow-hidden"
            style={{ width: mmActualW + 16, padding: 8 }}
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const cx = (e.clientX - rect.left - 8) / mmScale
              const cy = (e.clientY - rect.top - 8) / mmScale
              scrollRef.current?.scrollTo({ left: (cx - viewportSize.w / zoom / 2) * zoom, top: (cy - viewportSize.h / zoom / 2) * zoom, behavior: "smooth" })
            }}>
            <div className="relative cursor-pointer" style={{ width: mmActualW, height: mmActualH }}>
              {groupContainers.map(gc => (
                <div key={gc.spaceLabel} className="absolute rounded" style={{
                  left: gc.x * mmScale, top: gc.y * mmScale,
                  width: gc.width * mmScale, height: gc.height * mmScale,
                  border: `1px solid ${gc.groupColor}`, background: `${gc.groupColor}1a`
                }} />
              ))}
              {nodes.map(n => (
                <div key={n.id} className="absolute rounded-sm" style={{
                  left: n.x * mmScale, top: n.y * mmScale,
                  width: Math.max(3, nw(n) * mmScale), height: Math.max(2, nh(n) * mmScale),
                  background: n.special ? (n.special === "start" ? "#22c55e" : "#ef4444") : n.groupColor,
                  opacity: 0.85
                }} />
              ))}
              <div className="absolute border-2 border-blue-500 rounded pointer-events-none" style={{
                left: Math.max(0, scrollPos.left / zoom * mmScale),
                top: Math.max(0, scrollPos.top / zoom * mmScale),
                width: Math.min(mmActualW, viewportSize.w / zoom * mmScale),
                height: Math.min(mmActualH, viewportSize.h / zoom * mmScale),
                background: "rgba(59,130,246,0.05)"
              }} />
            </div>
          </div>
        )}
        </div>

        {/* 수정 이력 패널 (뷰 모드, showHistory) */}
        {active && !isEditing && showHistory && (
          <aside className="w-68 shrink-0 border-l bg-background flex flex-col overflow-hidden" style={{ width: 268 }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Clock className="size-3.5 text-muted-foreground" />수정 이력
              </div>
              <Badge variant="secondary" className="text-xs">{history.length}건</Badge>
            </div>
            <div className="flex-1 overflow-y-auto">
              {history.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">이력이 없습니다</div>
              ) : (
                <div className="divide-y">
                  {history.map((h, i) => (
                    <div key={h.id} className={cn("px-4 py-3 space-y-1.5", i === 0 && "bg-muted/30")}>
                      {i === 0 && <Badge variant="secondary" className="text-[9px] px-1.5 py-0">최신</Badge>}
                      <p className="text-xs font-medium text-foreground leading-snug">{h.desc}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-muted-foreground">{h.user}</span>
                        <span className="text-[10px] text-muted-foreground">{h.timestamp}</span>
                      </div>
                      {i > 0 && (
                        <button onClick={() => restoreHistory(h)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-1.5 py-0.5 hover:bg-muted">
                          <CornerUpLeft className="size-2.5" />이 버전으로 복구
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* 하단 */}
      <div className="flex items-center px-4 py-1.5 border-t text-[11px] text-muted-foreground shrink-0">
        {isEditing ? (
          <span>● 팔레트 드래그 → 캔버스 드롭  ·  ⊗ 클릭 → 노드 클릭 = 연결  ·  노드 드래그 = 이동  ·  Delete = 삭제  ·  Ctrl+휠 = 확대/축소</span>
        ) : (
          <span>{active ? `${active.name} · 등록일 ${active.createdAt}` : "BOP를 선택하거나 등록하세요"}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span>{nodes.length}개 노드 · {edges.length}개 연결{isDirty ? " · 미저장 변경사항" : ""}</span>
          <div className="flex items-center gap-1 border rounded-md overflow-hidden">
            <button className="px-1.5 py-0.5 hover:bg-muted transition-colors" onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}><ZoomOut className="size-3" /></button>
            <button className="px-1.5 py-0.5 hover:bg-muted transition-colors text-[10px] font-medium w-10 text-center" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
            <button className="px-1.5 py-0.5 hover:bg-muted transition-colors" onClick={() => setZoom(z => Math.min(2, z + 0.1))}><ZoomIn className="size-3" /></button>
          </div>
        </div>
      </div>

      {/* 신규 생성 다이얼로그 */}
      <Dialog open={createOpen} onOpenChange={v => { setCreateOpen(v); if (!v) setNewName("") }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader><DialogTitle>새 BOP 유형 등록</DialogTitle></DialogHeader>
          <div className="space-y-1.5 py-2">
            <Label className="text-xs text-muted-foreground">BOP 유형명 *</Label>
            <Input placeholder="예: 제육볶음 BOP" value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => { setCreateOpen(false); setNewName("") }}>취소</Button>
            <Button size="sm" onClick={handleCreate} disabled={!newName.trim()}>등록 후 편집 시작</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 공정 저장 다이얼로그 */}
      <Dialog open={savedProcessOpen} onOpenChange={v => { setSavedProcessOpen(v); if (!v) setSavedProcessName("") }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader><DialogTitle>현재 공정 저장</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground -mt-1">현재 캔버스의 공정 배치를 저장합니다. 저장된 공정은 다른 BOP 편집 시 팔레트에서 드래그해 재사용할 수 있습니다.</p>
          <div className="space-y-1.5 py-2">
            <Label className="text-xs text-muted-foreground">공정 이름 *</Label>
            <Input placeholder="예: 기본 냉각·내포장 공정" value={savedProcessName}
              onChange={e => setSavedProcessName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSaveProcess()} autoFocus />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSavedProcessOpen(false)}>취소</Button>
            <Button size="sm" onClick={handleSaveProcess} disabled={!savedProcessName.trim()}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader><DialogTitle>BOP 삭제</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            <strong>{active?.name}</strong> BOP를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>취소</Button>
            <Button size="sm" className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>삭제</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
