"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useLearningData } from "@/lib/mock-data-context"

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

function getWeekLabel(weekStart: Date): string {
  const today = new Date()
  const currentWeekStart = getWeekStart(today)
  const nextWeekStart = new Date(currentWeekStart)
  nextWeekStart.setDate(currentWeekStart.getDate() + 7)

  const weekStartTime = weekStart.getTime()
  const currentWeekStartTime = currentWeekStart.getTime()
  const nextWeekStartTime = nextWeekStart.getTime()

  if (weekStartTime === currentWeekStartTime) {
    return "This Week"
  } else if (weekStartTime === nextWeekStartTime) {
    return "Next Week"
  } else {
    const weekOfYear = getWeekOfYear(weekStart)
    const year = weekStart.getFullYear()
    return `Week ${weekOfYear}, ${year} · ${formatWeekRange(weekStart)}`
  }
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
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
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
          <div className="space-y-4">
            {sortedWeeks.map(([weekKey, items]) => {
              const firstItem = items[0]
              const deadline = new Date(firstItem.section.deadline!)
              const weekStart = getWeekStart(deadline)

              return (
                <section key={weekKey}>
                  <h2 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    {getWeekLabel(weekStart)}
                  </h2>
                  <div className="space-y-1.5">
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
  const { section, daysUntil } = item
  const deadline = new Date(section.deadline!)
  const showBadge = Math.abs(daysUntil) < 30

  return (
    <Link href={`/path/${section.pathId}/section/${section.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardContent className="px-3 py-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                {section.pathName}
              </div>
              <h3 className="font-medium text-sm leading-tight">{section.name}</h3>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs">
              {showBadge && (
                <span className={`font-medium ${daysUntil < 3 && daysUntil >= 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {daysUntil < 0
                    ? `${Math.abs(daysUntil)}d overdue`
                    : daysUntil === 0
                    ? "Today"
                    : daysUntil === 1
                    ? "Tomorrow"
                    : `${daysUntil}d`
                  }
                </span>
              )}
              <span className="text-muted-foreground">
                {deadline.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
