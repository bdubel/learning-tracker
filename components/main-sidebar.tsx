"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Plus } from "lucide-react"
import { useLearningData } from "@/lib/mock-data-context"

export function MainSidebar() {
  const pathname = usePathname()
  const { paths } = useLearningData()

  return (
    <div className="w-64 border-r bg-background h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">Learning Tracker</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Home */}
        <div className="p-3">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Learning Paths */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Learning Paths
            </h3>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {paths.map((path) => {
              const totalSections = path.units.reduce((acc, unit) => acc + unit.sections.length, 0)
              const completedSections = path.units.reduce(
                (acc, unit) => acc + unit.sections.filter((s) => s.isCompleted).length,
                0
              )

              return (
                <Link key={path.id} href={`/path/${path.id}`}>
                  <Button
                    variant={pathname?.startsWith(`/path/${path.id}`) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2 shrink-0" />
                    <div className="flex-1 text-left truncate">
                      <div className="truncate">{path.name}</div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">
                      {completedSections}/{totalSections}
                    </span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
