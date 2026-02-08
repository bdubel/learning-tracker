"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Lock, ChevronRight } from "lucide-react"
import { useLearningData } from "@/lib/mock-data-context"
import { format } from "date-fns"

interface PathSidebarProps {
  pathId: string
}

export function PathSidebar({ pathId }: PathSidebarProps) {
  const pathname = usePathname()
  const { paths } = useLearningData()

  const path = paths.find((p) => p.id === pathId)

  if (!path) return null

  return (
    <div className="w-72 border-r bg-muted/20 h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto py-2">
        {path.units.map((unit, unitIndex) => (
          <div key={unit.id} className="mb-6">
            <div className="px-4 py-2 mb-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Unit {unitIndex + 1}: {unit.name}
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
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs shrink-0">
                              {section.code}
                            </Badge>
                            <span className="text-sm truncate">{section.name}</span>
                          </div>
                          {section.deadline && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Due {format(new Date(section.deadline), "MMM d")}
                            </div>
                          )}
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
