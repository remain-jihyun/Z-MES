"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <aside className="w-56 shrink-0 border-r bg-gray-50 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 px-4 py-4 border-b bg-white">
        <Factory className="w-5 h-5 text-blue-600" />
        <div>
          <div className="text-sm font-bold text-gray-900">집반찬연구소</div>
          <div className="text-xs text-gray-500">MES v0.1</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((section) => (
          <div key={section.title}>
            <button
              onClick={() => toggle(section.title)}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700"
            >
              {section.title}
              {openSections[section.title] ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
            {openSections[section.title] && (
              <div className="mb-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-6 py-1.5 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t text-xs text-gray-400">
        관리자 · 2026-06-02
      </div>
    </aside>
  );
}
