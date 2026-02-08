"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Lock, ChevronRight } from "lucide-react"

// Mock data - will replace with real data
const mockPath = {
  id: "applied-geography",
  name: "Applied Geography",
  units: [
    {
      id: "unit-1",
      name: "Foundation",
      sections: [
        {
          id: "section-1a",
          name: "1A: US Geography",
          code: "1A",
          isUnlocked: true,
          isCompleted: false,
        },
        {
          id: "section-1b",
          name: "1B: World Regions Mental Model",
          code: "1B",
          isUnlocked: false,
          isCompleted: false,
        },
        {
          id: "section-1c",
          name: "1C: Core Countries—Europe & Americas",
          code: "1C",
          isUnlocked: false,
          isCompleted: false,
        },
        {
          id: "section-1d",
          name: "1D: Core Countries—Middle East & Africa",
          code: "1D",
          isUnlocked: false,
          isCompleted: false,
        },
      ],
    },
    {
      id: "unit-2",
      name: "Strategic Geography",
      sections: [
        {
          id: "section-2a",
          name: "2A: Chokepoints & Trade Routes",
          code: "2A",
          isUnlocked: false,
          isCompleted: false,
        },
        {
          id: "section-2b",
          name: "2B: Asia-Pacific",
          code: "2B",
          isUnlocked: false,
          isCompleted: false,
        },
        {
          id: "section-2c",
          name: "2C: Russia, Eastern Europe & Central Asia",
          code: "2C",
          isUnlocked: false,
          isCompleted: false,
        },
        {
          id: "section-2d",
          name: "2D: Resources & Economic Geography",
          code: "2D",
          isUnlocked: false,
          isCompleted: false,
        },
      ],
    },
  ],
}

interface PathSidebarProps {
  pathId: string
}

export function PathSidebar({ pathId }: PathSidebarProps) {
  const pathname = usePathname()
  const path = mockPath // TODO: Fetch real data based on pathId

  const totalSections = path.units.reduce((acc, unit) => acc + unit.sections.length, 0)
  const completedSections = path.units.reduce(
    (acc, unit) => acc + unit.sections.filter((s) => s.isCompleted).length,
    0
  )
  const progress = (completedSections / totalSections) * 100

  return (
    <div className="w-72 border-r bg-muted/20 h-screen flex flex-col">
      <div className="p-4 border-b bg-background">
        <h2 className="font-semibold text-sm mb-3">{path.name}</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedSections} / {totalSections}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {path.units.map((unit) => (
          <div key={unit.id} className="mb-4">
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {unit.name}
              </h3>
            </div>
            <div className="space-y-0.5 px-2">
              {unit.sections.map((section) => {
                const isActive = pathname?.includes(`/section/${section.id}`)

                return (
                  <Link
                    key={section.id}
                    href={
                      section.isUnlocked
                        ? `/path/${pathId}/section/${section.id}`
                        : "#"
                    }
                    className={section.isUnlocked ? "" : "pointer-events-none"}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto py-2 px-3"
                      size="sm"
                      disabled={!section.isUnlocked}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div className="shrink-0">
                          {section.isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : section.isUnlocked ? (
                            <Circle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm truncate">{section.name}</div>
                        </div>
                        {isActive && (
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                      </div>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
