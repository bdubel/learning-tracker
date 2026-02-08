"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, BookOpen, Plus } from "lucide-react"

// Mock data - will replace with Supabase queries
const mockData = {
  weeklyItems: [
    {
      id: "section-1a",
      name: "1A: US Geography",
      pathId: "applied-geography",
      pathName: "Applied Geography",
      daysUntil: 9,
    },
  ],
  learningPaths: [
    {
      id: "applied-geography",
      name: "Applied Geography",
      completedSections: 0,
      totalSections: 14,
      progress: 0,
    },
  ],
}

function getDaysUntilBadge(days: number) {
  if (days < 0) return <Badge variant="destructive" className="text-xs">Overdue</Badge>
  if (days === 0) return <Badge variant="destructive" className="text-xs">Today</Badge>
  if (days <= 3) return <Badge variant="destructive" className="text-xs">{days}d</Badge>
  if (days <= 7) return <Badge variant="secondary" className="text-xs">{days}d</Badge>
  return null
}

export function MainSidebar() {
  const pathname = usePathname()
  const { weeklyItems, learningPaths } = mockData

  return (
    <div className="w-64 border-r bg-background h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">Learning Tracker</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Home / Weekly Overview */}
        <div className="p-3">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
            >
              <Home className="h-4 w-4 mr-2" />
              Weekly Overview
            </Button>
          </Link>
        </div>

        {/* This Week Section */}
        {weeklyItems.length > 0 && (
          <div className="px-3 pb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
              This Week
            </h3>
            <div className="space-y-1">
              {weeklyItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/path/${item.pathId}/section/${item.id}`}
                >
                  <Card className="hover:bg-accent cursor-pointer transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm font-medium line-clamp-1">
                          {item.name}
                        </span>
                        {getDaysUntilBadge(item.daysUntil)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.pathName}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

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
            {learningPaths.map((path) => (
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
                    {path.completedSections}/{path.totalSections}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
