"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLearningData } from "@/lib/mock-data-context"

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Weekly Overview</h1>
          <p className="text-muted-foreground mt-2">
            Your upcoming deadlines and learning progress
          </p>
        </div>

        <WeeklyAgenda />
      </div>
    </div>
  )
}

function WeeklyAgenda() {
  const { getWeeklyItems } = useLearningData()
  const allItems = getWeeklyItems()

  const today = new Date()
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (7 - today.getDay())) // End of this week (Sunday)

  const endOfNextWeek = new Date(endOfWeek)
  endOfNextWeek.setDate(endOfWeek.getDate() + 7) // End of next week

  const thisWeek = allItems.filter((item) => {
    if (!item.section.deadline) return false
    const deadline = new Date(item.section.deadline)
    return deadline <= endOfWeek
  })

  const nextWeek = allItems.filter((item) => {
    if (!item.section.deadline) return false
    const deadline = new Date(item.section.deadline)
    return deadline > endOfWeek && deadline <= endOfNextWeek
  })

  if (thisWeek.length === 0 && nextWeek.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No upcoming deadlines</p>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* This Week */}
      {thisWeek.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">This Week</h2>
          <div className="grid gap-4">
            {thisWeek.map((item: any) => (
              <DeadlineCard key={item.section.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Next Week */}
      {nextWeek.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Next Week</h2>
          <div className="grid gap-4">
            {nextWeek.map((item: any) => (
              <DeadlineCard key={item.section.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function DeadlineCard({ item }: { item: { section: any; daysUntil: number } }) {
  const { section, daysUntil } = item

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{section.name}</CardTitle>
            <CardDescription>{section.pathName}</CardDescription>
          </div>
          <Badge variant={daysUntil < 3 ? "destructive" : "secondary"}>
            {daysUntil < 0 ? "Overdue" : daysUntil === 0 ? "Due today" : daysUntil === 1 ? "Due tomorrow" : `${daysUntil} days`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild size="sm">
          <Link href={`/path/${section.pathId}/section/${section.id}`}>
            Continue
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
