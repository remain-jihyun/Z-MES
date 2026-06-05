"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ClipboardList } from "lucide-react"
import { CHANGELOG, CHANGE_TYPE_LABEL } from "@/lib/changelog"
import { cn } from "@/lib/utils"

interface ChangeLogBannerProps {
  pageHref: string
}

export function ChangeLogBanner({ pageHref }: ChangeLogBannerProps) {
  const [open, setOpen] = useState(false)

  const log = CHANGELOG.find(c => c.href === pageHref)
  if (!log) return null

  const allItems = log.entries.flatMap(e => e.items.map(item => ({ ...item, date: e.date })))
  const latest = log.entries[0]?.date ?? ""

  return (
    <div className="border-b bg-amber-50 border-amber-200">
      <button
        className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-amber-100 transition-colors"
        onClick={() => setOpen(v => !v)}>
        <ClipboardList className="size-3.5 text-amber-600 shrink-0" />
        <span className="text-xs font-semibold text-amber-800">
          수정 이력 — {log.page}
        </span>
        <span className="text-[10px] text-amber-600 ml-1">
          최근 {latest} · {allItems.length}건
        </span>
        <span className="ml-auto text-[10px] text-amber-500 italic">개발 확인용 (추후 제거)</span>
        {open
          ? <ChevronUp className="size-3.5 text-amber-500 shrink-0" />
          : <ChevronDown className="size-3.5 text-amber-500 shrink-0" />}
      </button>

      {open && (
        <div className="px-4 pb-3 space-y-3">
          {log.entries.map(entry => (
            <div key={entry.date}>
              <div className="text-[10px] font-semibold text-amber-700 mb-1.5">{entry.date}</div>
              <div className="space-y-1">
                {entry.items.map((item, i) => {
                  const meta = item.type ? CHANGE_TYPE_LABEL[item.type] : null
                  return (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-900">
                      {meta && (
                        <span className={cn("shrink-0 text-[9px] font-semibold px-1.5 py-px rounded-full mt-px", meta.color)}>
                          {meta.label}
                        </span>
                      )}
                      <span>{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
