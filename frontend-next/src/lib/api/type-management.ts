import { mockTemperatures, mockSpaces, mockProcesses } from "@/mocks/type-management"
import type { Temperature, Space, Process } from "@/types/type-management"

let temperatures = [...mockTemperatures]
let spaces = [...mockSpaces]
let processes = [...mockProcesses]

// ── 온도 API ──

export async function getTemperatures(): Promise<Temperature[]> {
  return [...temperatures].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function createTemperature(
  data: Omit<Temperature, "id" | "sortOrder">
): Promise<Temperature> {
  const maxOrder = temperatures.reduce((max, t) => Math.max(max, t.sortOrder), 0)
  const newItem: Temperature = {
    ...data,
    id: `TEMP-${String(temperatures.length + 1).padStart(3, "0")}`,
    sortOrder: maxOrder + 1,
  }
  temperatures.push(newItem)
  return newItem
}

export async function updateTemperature(
  id: string,
  data: Partial<Omit<Temperature, "id">>
): Promise<Temperature> {
  const idx = temperatures.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error("온도 유형을 찾을 수 없습니다")
  temperatures[idx] = { ...temperatures[idx], ...data }

  if (data.name) {
    spaces = spaces.map((s) =>
      s.temperatureId === id ? { ...s, temperatureName: data.name ?? s.temperatureName } : s
    )
  }

  return temperatures[idx]
}

export async function deleteTemperature(id: string): Promise<{ success: boolean; message?: string }> {
  const referencingSpaces = spaces.filter((s) => s.temperatureId === id)
  if (referencingSpaces.length > 0) {
    return {
      success: false,
      message: `이 온도유형을 참조하는 공간이 ${referencingSpaces.length}건 있습니다. (${referencingSpaces.map((s) => s.name).join(", ")})`,
    }
  }
  temperatures = temperatures.filter((t) => t.id !== id)
  return { success: true }
}

export async function reorderTemperature(id: string, direction: "up" | "down"): Promise<void> {
  const sorted = [...temperatures].sort((a, b) => a.sortOrder - b.sortOrder)
  const idx = sorted.findIndex((t) => t.id === id)
  if (idx === -1) return

  const swapIdx = direction === "up" ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= sorted.length) return

  const tempOrder = sorted[idx].sortOrder
  sorted[idx].sortOrder = sorted[swapIdx].sortOrder
  sorted[swapIdx].sortOrder = tempOrder

  temperatures = sorted
}

// ── 공간 API ──

export async function getSpaces(): Promise<Space[]> {
  return [...spaces].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getSpacesByFloor(): Promise<Map<string, Space[]>> {
  const sorted = [...spaces].sort((a, b) => a.sortOrder - b.sortOrder)
  const grouped = new Map<string, Space[]>()

  for (const space of sorted) {
    const existing = grouped.get(space.floor)
    if (existing) {
      existing.push(space)
    } else {
      grouped.set(space.floor, [space])
    }
  }

  return grouped
}

export async function getFloors(): Promise<string[]> {
  const floorSet = new Set(spaces.map((s) => s.floor))
  return Array.from(floorSet)
}

export async function createSpace(
  data: Omit<Space, "id" | "sortOrder">
): Promise<Space> {
  const floorSpaces = spaces.filter((s) => s.floor === data.floor)
  const maxOrder = floorSpaces.reduce((max, s) => Math.max(max, s.sortOrder), 0)
  const newItem: Space = {
    ...data,
    id: `SPC-${String(spaces.length + 1).padStart(3, "0")}`,
    sortOrder: maxOrder + 1,
  }
  spaces.push(newItem)
  return newItem
}

export async function updateSpace(
  id: string,
  data: Partial<Omit<Space, "id">>
): Promise<Space> {
  const idx = spaces.findIndex((s) => s.id === id)
  if (idx === -1) throw new Error("공간을 찾을 수 없습니다")
  spaces[idx] = { ...spaces[idx], ...data }

  if (data.name) {
    processes = processes.map((p) =>
      p.spaceId === id ? { ...p, spaceName: data.name ?? p.spaceName } : p
    )
  }

  return spaces[idx]
}

export async function deleteSpace(id: string): Promise<{ success: boolean; message?: string }> {
  const referencingProcesses = processes.filter((p) => p.spaceId === id)
  if (referencingProcesses.length > 0) {
    return {
      success: false,
      message: `이 공간을 참조하는 공정이 ${referencingProcesses.length}건 있습니다. (${referencingProcesses.map((p) => p.name).join(", ")})`,
    }
  }
  spaces = spaces.filter((s) => s.id !== id)
  return { success: true }
}

export async function reorderSpace(id: string, direction: "up" | "down"): Promise<void> {
  const space = spaces.find((s) => s.id === id)
  if (!space) return

  const floorSpaces = spaces
    .filter((s) => s.floor === space.floor)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const idx = floorSpaces.findIndex((s) => s.id === id)
  const swapIdx = direction === "up" ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= floorSpaces.length) return

  const tempOrder = floorSpaces[idx].sortOrder
  floorSpaces[idx].sortOrder = floorSpaces[swapIdx].sortOrder
  floorSpaces[swapIdx].sortOrder = tempOrder
}

// ── 공정 API ──

export async function getProcesses(): Promise<Process[]> {
  return [...processes].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getProcessesBySpace(): Promise<{ spaceName: string; spaceId: string; items: Process[] }[]> {
  const sorted = [...processes].sort((a, b) => a.sortOrder - b.sortOrder)
  const groupMap = new Map<string, { spaceName: string; spaceId: string; items: Process[] }>()

  for (const proc of sorted) {
    const existing = groupMap.get(proc.spaceId)
    if (existing) {
      existing.items.push(proc)
    } else {
      groupMap.set(proc.spaceId, {
        spaceName: proc.spaceName,
        spaceId: proc.spaceId,
        items: [proc],
      })
    }
  }

  return Array.from(groupMap.values())
}

export async function createProcess(
  data: Omit<Process, "id" | "sortOrder">
): Promise<Process> {
  const spaceProcesses = processes.filter((p) => p.spaceId === data.spaceId)
  const maxOrder = spaceProcesses.reduce((max, p) => Math.max(max, p.sortOrder), 0)
  const newItem: Process = {
    ...data,
    id: `PRC-${String(processes.length + 1).padStart(3, "0")}`,
    sortOrder: maxOrder + 1,
  }
  processes.push(newItem)
  return newItem
}

export async function updateProcess(
  id: string,
  data: Partial<Omit<Process, "id">>
): Promise<Process> {
  const idx = processes.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error("공정을 찾을 수 없습니다")
  processes[idx] = { ...processes[idx], ...data }
  return processes[idx]
}

export async function deleteProcess(id: string): Promise<{ success: boolean }> {
  processes = processes.filter((p) => p.id !== id)
  return { success: true }
}

export async function reorderProcess(id: string, direction: "up" | "down"): Promise<void> {
  const process = processes.find((p) => p.id === id)
  if (!process) return

  const spaceProcesses = processes
    .filter((p) => p.spaceId === process.spaceId)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const idx = spaceProcesses.findIndex((p) => p.id === id)
  const swapIdx = direction === "up" ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= spaceProcesses.length) return

  const tempOrder = spaceProcesses[idx].sortOrder
  spaceProcesses[idx].sortOrder = spaceProcesses[swapIdx].sortOrder
  spaceProcesses[swapIdx].sortOrder = tempOrder
}
