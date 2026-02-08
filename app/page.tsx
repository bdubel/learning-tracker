"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useLearningData } from "@/lib/mock-data-context"
import { CheckCircle2, Circle } from "lucide-react"

export default function Home() {
  const { getAllItemsWithDeadlines } = useLearningData()
  const allItems = getAllItemsWithDeadlines()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Get all dates with deadlines
  const deadlineDates = allItems.map(item => new Date(item.section.deadline!))

  // Get items for selected date
  const itemsForSelectedDate = selectedDate
    ? allItems.filter(item => {
        const itemDate = new Date(item.section.deadline!)
        return itemDate.toDateString() === selectedDate.toDateString()
      })
    : []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground mt-2">
            Your learning overview and upcoming deadlines
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Click a date to see sections due</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    deadline: deadlineDates,
                  }}
                  modifiersStyles={{
                    deadline: {
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }
                  }}
                />
              </CardContent>
            </Card>

            {/* Selected Date Items */}
            {selectedDate && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {itemsForSelectedDate.length > 0 ? (
                    <div className="space-y-3">
                      {itemsForSelectedDate.map(item => (
                        <DeadlineItem key={item.section.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No sections due on this date</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upcoming List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>Next deadlines for each path</CardDescription>
              </CardHeader>
              <CardContent>
                {allItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No upcoming deadlines
                  </p>
                ) : (
                  <div className="space-y-3">
                    {allItems
                      .filter(item => item.isNext)
                      .map(item => (
                        <DeadlineItem key={item.section.id} item={item} showPath />
                      ))}

                    {allItems.filter(item => item.isNext).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No upcoming deadlines
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Upcoming */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>All Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {allItems.map(item => (
                    <DeadlineItem key={item.section.id} item={item} compact />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeadlineItem({
  item,
  showPath = false,
  compact = false
}: {
  item: { section: any; daysUntil: number; isNext: boolean }
  showPath?: boolean
  compact?: boolean
}) {
  const { section, daysUntil, isNext } = item

  if (compact) {
    return (
      <Link href={`/path/${section.pathId}/section/${section.id}`}>
        <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted transition-colors cursor-pointer">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isNext ? (
              <Circle className="h-3 w-3 text-blue-600 shrink-0" />
            ) : (
              <Circle className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
            <span className="text-sm truncate">{section.name}</span>
          </div>
          <Badge variant={daysUntil < 3 ? "destructive" : "secondary"} className="text-xs shrink-0 ml-2">
            {daysUntil < 0 ? `${Math.abs(daysUntil)}d ago` : daysUntil === 0 ? "Today" : `${daysUntil}d`}
          </Badge>
        </div>
      </Link>
    )
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isNext && <Badge variant="outline" className="text-xs">Next</Badge>}
          </div>
          <h3 className="font-medium truncate">{section.name}</h3>
          {showPath && (
            <p className="text-sm text-muted-foreground">{section.pathName}</p>
          )}
        </div>
        <Badge variant={daysUntil < 3 ? "destructive" : "secondary"} className="shrink-0 ml-2">
          {daysUntil < 0
            ? "Overdue"
            : daysUntil === 0
            ? "Due today"
            : daysUntil === 1
            ? "Due tomorrow"
            : `${daysUntil} days`
          }
        </Badge>
      </div>
      <Button asChild size="sm" className="w-full">
        <Link href={`/path/${section.pathId}/section/${section.id}`}>
          Continue
        </Link>
      </Button>
    </div>
  )
}
