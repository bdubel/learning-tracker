"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLearningData } from "@/lib/mock-data-context"
import { Circle } from "lucide-react"

function getWeekOfYear(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function getWeekStart(date: Date): Date {
  const day = date.getDay()
  const diff = date.getDate() - day
  return new Date(date.getFullYear(), date.getMonth(), diff)
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' })
  const startDay = weekStart.getDate()
  const endDay = weekEnd.getDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}`
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

export default function Home() {
  const { getAllItemsWithDeadlines } = useLearningData()
  const allItems = getAllItemsWithDeadlines()

  // Group items by week
  const itemsByWeek = new Map<string, typeof allItems>()

  allItems.forEach(item => {
    const deadline = new Date(item.section.deadline!)
    const weekStart = getWeekStart(deadline)
    const weekKey = `${weekStart.getFullYear()}-W${getWeekOfYear(deadline)}`

    if (!itemsByWeek.has(weekKey)) {
      itemsByWeek.set(weekKey, [])
    }
    itemsByWeek.get(weekKey)!.push(item)
  })

  // Sort weeks chronologically
  const sortedWeeks = Array.from(itemsByWeek.entries()).sort((a, b) => {
    const [yearA, weekA] = a[0].split('-W').map(Number)
    const [yearB, weekB] = b[0].split('-W').map(Number)
    if (yearA !== yearB) return yearA - yearB
    return weekA - weekB
  })

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-6 px-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your upcoming deadlines grouped by week
          </p>
        </div>

        {allItems.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No upcoming deadlines</p>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedWeeks.map(([weekKey, items]) => {
              const firstItem = items[0]
              const deadline = new Date(firstItem.section.deadline!)
              const weekStart = getWeekStart(deadline)
              const weekOfYear = getWeekOfYear(deadline)
              const year = deadline.getFullYear()

              return (
                <section key={weekKey}>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                    Week {weekOfYear}, {year} · {formatWeekRange(weekStart)}
                  </h2>
                  <div className="space-y-2">
                    {items.map(item => (
                      <SectionCard key={item.section.id} item={item} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionCard({ item }: { item: { section: any; daysUntil: number; isNext: boolean } }) {
  const { section, daysUntil, isNext } = item
  const deadline = new Date(section.deadline!)

  return (
    <Link href={`/path/${section.pathId}/section/${section.id}`}>
      <Card className="hover:shadow-sm transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isNext && (
                  <Circle className="h-2.5 w-2.5 text-blue-600 fill-blue-600 shrink-0" />
                )}
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {section.pathName}
                </span>
              </div>
              <h3 className="font-medium text-base mb-1">{section.name}</h3>
              <p className="text-xs text-muted-foreground">
                {deadline.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <Badge variant={daysUntil < 3 ? "destructive" : "secondary"} className="shrink-0">
              {daysUntil < 0
                ? `${Math.abs(daysUntil)}d`
                : daysUntil === 0
                ? "Today"
                : daysUntil === 1
                ? "1d"
                : `${daysUntil}d`
              }
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
