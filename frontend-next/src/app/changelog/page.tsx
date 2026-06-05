"use client"

import Link from "next/link"
import { CHANGELOG, CHANGE_TYPE_LABEL } from "@/lib/changelog"
import { cn } from "@/lib/utils"
import { ClipboardList } from "lucide-react"

export default function ChangelogPage() {
  const allDates = [...new Set(
    CHANGELOG.flatMap(c => c.entries.map(e => e.date))
  )].sort((a, b) => b.localeCompare(a))

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">개발 확인용 (추후 제거)</p>
        <h1 className="text-xl font-bold mt-0.5 flex items-center gap-2">
          <ClipboardList className="size-5 text-amber-500" />
          수정 이력
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          2026-06-04 이후 반영된 페이지별 변경사항입니다.
        </p>
      </div>

      {/* 날짜별 그룹 */}
      <div className="space-y-8">
        {allDates.map(date => {
          const pageEntries = CHANGELOG
            .map(page => ({
              page,
              items: page.entries.find(e => e.date === date)?.items ?? [],
            }))
            .filter(p => p.items.length > 0)

          return (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold text-foreground">{date}</span>
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground">
                  {pageEntries.reduce((s, p) => s + p.items.length, 0)}건
                </span>
              </div>

              <div className="space-y-4">
                {pageEntries.map(({ page, items }) => (
                  <div key={page.href} className="rounded-lg border overflow-hidden">
                    {/* 페이지 헤더 */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b">
                      <span className="text-[10px] text-muted-foreground font-medium">{page.section}</span>
                      <span className="text-muted-foreground">/</span>
                      <Link href={page.href}
                        className="text-sm font-semibold text-foreground hover:text-primary hover:underline">
                        {page.page}
                      </Link>
                      <span className="ml-auto text-[10px] text-muted-foreground">{items.length}건</span>
                    </div>

                    {/* 변경 항목 */}
                    <div className="divide-y">
                      {items.map((item, i) => {
                        const meta = item.type ? CHANGE_TYPE_LABEL[item.type] : null
                        return (
                          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                            {meta ? (
                              <span className={cn("shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full", meta.color)}>
                                {meta.label}
                              </span>
                            ) : (
                              <span className="shrink-0 w-10" />
                            )}
                            <span className="text-sm text-foreground">{item.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 범례 */}
      <div className="rounded-lg border p-3 bg-muted/20">
        <p className="text-xs font-medium text-muted-foreground mb-2">변경 유형</p>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(CHANGE_TYPE_LABEL) as [string, { label: string; color: string }][]).map(([, meta]) => (
            <span key={meta.label} className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full", meta.color)}>
              {meta.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
