"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { cn } from "@/lib/utils"
import type { TypeManagementTab } from "@/types/type-management"
import { ChangeLogBanner } from "@/components/ChangeLogBanner"
import { SpaceTab } from "@/components/type-management/SpaceTab"
import { ProcessTab } from "@/components/type-management/ProcessTab"
import { DeviceTab } from "@/components/type-management/DeviceTab"

const TABS: { value: TypeManagementTab; label: string }[] = [
  { value: "space", label: "공간" },
  { value: "process", label: "공정" },
  { value: "device", label: "디바이스 설정" },
]

function TypeManagementInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = (searchParams.get("tab") as TypeManagementTab) || "space"

  const handleTabChange = (value: TypeManagementTab) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-4">
      <ChangeLogBanner pageHref="/master/types" />
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <p className="text-sm text-muted-foreground">기초정보</p>
          <h1 className="text-2xl font-bold tracking-tight">유형관리</h1>
        </div>

        <div className="flex items-center gap-1 rounded-lg border bg-muted p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                currentTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6">
        {currentTab === "space" && <SpaceTab />}
        {currentTab === "process" && <ProcessTab />}
        {currentTab === "device" && <DeviceTab />}
      </div>
    </div>
  )
}

export default function TypeManagementPage() {
  return (
    <Suspense>
      <TypeManagementInner />
    </Suspense>
  )
}
