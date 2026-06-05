"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
}

interface FilterMultiSelectProps {
  label: string
  options: FilterOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function FilterMultiSelect({
  label,
  options,
  selected,
  onChange,
  className,
}: FilterMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const displayLabel = () => {
    if (selected.length === 0) return null
    if (selected.length === 1) return options.find((o) => o.value === selected[0])?.label
    return `${options.find((o) => o.value === selected[0])?.label} 외 ${selected.length - 1}개`
  }

  const display = displayLabel()

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-1.5 pr-2 pl-2.5 text-sm whitespace-nowrap h-8 transition-colors hover:bg-accent/50",
          open && "border-ring ring-1 ring-ring/30",
          className,
        )}
      >
        <span className={cn("text-left truncate", !display && "text-muted-foreground")}>
          {display ?? label}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 min-w-36 w-max rounded-lg bg-popover shadow-md ring-1 ring-foreground/10 p-1">
          {/* 전체 */}
          <button
            type="button"
            onClick={() => onChange([])}
            className="flex w-full items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent text-left"
          >
            <span className={cn("flex size-4 items-center justify-center rounded border border-input shrink-0", selected.length === 0 && "bg-primary border-primary")}>
              {selected.length === 0 && <Check className="size-3 text-white" />}
            </span>
            전체
          </button>
          {options.map((opt) => {
            const checked = selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className="flex w-full items-center gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent text-left"
              >
                <span className={cn("flex size-4 items-center justify-center rounded border border-input shrink-0", checked && "bg-primary border-primary")}>
                  {checked && <Check className="size-3 text-white" />}
                </span>
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
