"use client"

import { useState, useEffect, useCallback } from "react"
import type { Temperature, Space, Process } from "@/types/type-management"
import {
  getTemperatures,
  getSpacesByFloor,
  getProcessesBySpace,
  getSpaces,
} from "@/lib/api/type-management"

export function useTemperatures() {
  const [items, setItems] = useState<Temperature[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTemperatures()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { items, loading, refetch: fetch }
}

export function useSpaces() {
  const [grouped, setGrouped] = useState<Map<string, Space[]>>(new Map())
  const [allSpaces, setAllSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [groupedData, allData] = await Promise.all([
        getSpacesByFloor(),
        getSpaces(),
      ])
      setGrouped(groupedData)
      setAllSpaces(allData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const total = allSpaces.length

  return { grouped, allSpaces, total, loading, refetch: fetch }
}

export function useProcesses() {
  const [groups, setGroups] = useState<{ spaceName: string; spaceId: string; items: Process[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProcessesBySpace()
      setGroups(data)
      setTotal(data.reduce((sum, g) => sum + g.items.length, 0))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { groups, total, loading, refetch: fetch }
}
