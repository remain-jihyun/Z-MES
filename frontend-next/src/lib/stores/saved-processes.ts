export type SavedProcessNode = {
  id: string; paletteId: string; groupId: string; groupColor: string; spaceLabel: string
  label: string; isCcp: boolean; isInspection: boolean; isCooling: boolean; createKanban: boolean
  special?: "start" | "end"; x: number; y: number
}
export type SavedProcessEdge = { id: string; from: string; to: string }

export type SavedProcess = {
  id: string
  name: string
  nodes: SavedProcessNode[]
  edges: SavedProcessEdge[]
  createdAt: string
  usedInBops: { id: string; name: string }[]
}

let store: SavedProcess[] = [
  {
    id: "saved-001", name: "불출·전처리 공정", createdAt: "2026.06.01",
    usedInBops: [{ id: "dak", name: "닭갈비" }],
    nodes: [
      { id:"s01-n1", paletteId:"prc-029",   groupId:"material",   groupColor:"#f59e0b", spaceLabel:"불출실",  label:"자재 입고",          isCcp:false, isInspection:true,  isCooling:false, createKanban:true,  x:60,  y:286 },
      { id:"s01-n2", paletteId:"prc-004",   groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실", label:"전처리 - 야채류",    isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:308, y:194 },
      { id:"s01-n3", paletteId:"prc-005",   groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실", label:"전처리 - 수산/육류", isCcp:false, isInspection:false, isCooling:false, createKanban:true,  x:308, y:286 },
      { id:"s01-n4", paletteId:"prc-006",   groupId:"preprocess", groupColor:"#f97316", spaceLabel:"전처리실", label:"전처리 - 검수",      isCcp:false, isInspection:true,  isCooling:false, createKanban:true,  x:308, y:378 },
    ],
    edges: [
      { id:"s01-e1", from:"s01-n1", to:"s01-n2" },
      { id:"s01-e2", from:"s01-n1", to:"s01-n3" },
      { id:"s01-e3", from:"s01-n1", to:"s01-n4" },
    ],
  },
  {
    id: "saved-002", name: "조리·냉각 공정", createdAt: "2026.06.02",
    usedInBops: [{ id: "dak", name: "닭갈비" }],
    nodes: [
      { id:"s02-n1", paletteId:"prc-010",   groupId:"cooking", groupColor:"#ef4444", spaceLabel:"조리실", label:"조리 - 국솥", isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:60,  y:240 },
      { id:"s02-n2", paletteId:"prc-014",   groupId:"cooking", groupColor:"#ef4444", spaceLabel:"조리실", label:"조리 - 검수", isCcp:false, isInspection:true,  isCooling:false, createKanban:true, x:60,  y:332 },
      { id:"s02-n3", paletteId:"prc-024",   groupId:"cooling", groupColor:"#3b82f6", spaceLabel:"냉각실", label:"냉각",       isCcp:false, isInspection:false, isCooling:true,  createKanban:true, x:308, y:240 },
      { id:"s02-n4", paletteId:"prc-023",   groupId:"cooling", groupColor:"#3b82f6", spaceLabel:"냉각실", label:"방열",       isCcp:false, isInspection:false, isCooling:true,  createKanban:true, x:308, y:332 },
    ],
    edges: [
      { id:"s02-e1", from:"s02-n1", to:"s02-n3" },
      { id:"s02-e2", from:"s02-n2", to:"s02-n4" },
    ],
  },
  {
    id: "saved-003", name: "내포장·출고 공정", createdAt: "2026.06.03",
    usedInBops: [],
    nodes: [
      { id:"s03-n1", paletteId:"prc-015",   groupId:"inner", groupColor:"#10b981", spaceLabel:"내포장실", label:"내포장 - 소용량", isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:60,  y:196 },
      { id:"s03-n2", paletteId:"prc-016",   groupId:"inner", groupColor:"#10b981", spaceLabel:"내포장실", label:"내포장 - 대용량", isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:60,  y:288 },
      { id:"s03-n3", paletteId:"prc-022",   groupId:"inner", groupColor:"#10b981", spaceLabel:"내포장실", label:"금속검출기",      isCcp:true,  isInspection:false, isCooling:false, createKanban:true, x:60,  y:380 },
      { id:"s03-n4", paletteId:"prc-026",   groupId:"outer", groupColor:"#8b5cf6", spaceLabel:"외포장실", label:"피킹",           isCcp:false, isInspection:true,  isCooling:false, createKanban:true, x:308, y:240 },
      { id:"s03-n5", paletteId:"prc-027",   groupId:"outer", groupColor:"#8b5cf6", spaceLabel:"외포장실", label:"패킹",           isCcp:false, isInspection:false, isCooling:false, createKanban:true, x:308, y:332 },
    ],
    edges: [
      { id:"s03-e1", from:"s03-n1", to:"s03-n4" },
      { id:"s03-e2", from:"s03-n2", to:"s03-n4" },
      { id:"s03-e3", from:"s03-n3", to:"s03-n5" },
    ],
  },
]

export function getSavedProcesses(): SavedProcess[] {
  return [...store]
}

export function addSavedProcess(sp: SavedProcess): void {
  store = [...store, { ...sp, usedInBops: [] }]
}

export function updateSavedProcessName(id: string, name: string): void {
  store = store.map(sp => sp.id === id ? { ...sp, name } : sp)
}

export function deleteSavedProcess(id: string): void {
  store = store.filter(sp => sp.id !== id)
}

export function linkBopToSavedProcess(savedId: string, bop: { id: string; name: string }): void {
  store = store.map(sp =>
    sp.id === savedId && !sp.usedInBops.some(b => b.id === bop.id)
      ? { ...sp, usedInBops: [...sp.usedInBops, bop] }
      : sp
  )
}
