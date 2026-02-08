"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Lock } from "lucide-react"
import { useLearningData } from "@/lib/mock-data-context"
import { use } from "react"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getDaysUntil(dateString: string) {
  const today = new Date()
  const deadline = new Date(dateString)
  const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function LearningPathPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { paths } = useLearningData()

  const path = paths.find((p) => p.id === id)

  if (!path) {
    notFound()
  }

  const totalSections = path.units.reduce((acc, unit) => acc + unit.sections.length, 0)
  const completedSections = path.units.reduce(
    (acc, unit) => acc + unit.sections.filter((s) => s.isCompleted).length,
    0
  )
  const progressPercentage = (completedSections / totalSections) * 100

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-8 max-w-5xl">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{path.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-3xl">{path.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sections Completed</span>
                <span className="font-medium">
                  {completedSections} / {totalSections}
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </CardContent>
        </Card>

        {/* Units and Sections */}
        <div className="space-y-8">
          {path.units.map((unit, unitIndex) => (
            <section key={unit.id}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">
                  Unit {unitIndex + 1}: {unit.name}
                  {unit.completeBy && (
                    <span className="text-sm font-normal text-muted-foreground ml-3">
                      Complete by {formatDate(unit.completeBy)}
                    </span>
                  )}
                </h2>
                <Badge variant="outline" className="text-xs">
                  {unit.sections.filter((s) => s.isCompleted).length} / {unit.sections.length}
                </Badge>
              </div>

              <div className="space-y-1">
                {unit.sections.map((section) => {
                  const daysUntil = section.deadline ? getDaysUntil(section.deadline) : null
                  const isUrgent = daysUntil !== null && daysUntil < 3 && daysUntil >= 0
                  const showRelativeTime = daysUntil !== null && Math.abs(daysUntil) < 30

                  const relativeTime = daysUntil !== null && (
                    daysUntil < 0
                      ? `${Math.abs(daysUntil)}d overdue`
                      : daysUntil === 0
                      ? "Today"
                      : daysUntil === 1
                      ? "Tomorrow"
                      : `${daysUntil}d`
                  )

                  return (
                    <Link
                      key={section.id}
                      href={section.isUnlocked ? `/path/${id}/section/${section.id}` : "#"}
                      className={!section.isUnlocked ? "pointer-events-none" : ""}
                    >
                      <div className={`flex items-center justify-between py-2 px-3 rounded-md border bg-card transition-colors ${section.isUnlocked ? "hover:bg-accent/50" : "opacity-60"}`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="shrink-0">
                            {section.isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : section.isUnlocked ? (
                              <Circle className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{section.name}</div>
                            {!section.isUnlocked && (
                              <div className="text-xs text-muted-foreground">Locked</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-xs ml-4">
                          {showRelativeTime && section.isUnlocked && !section.isCompleted && (
                            <Badge variant={isUrgent ? "destructive" : "secondary"} className="font-normal">
                              {relativeTime}
                            </Badge>
                          )}
                          {section.deadline && section.isUnlocked && (
                            <span className="text-muted-foreground whitespace-nowrap">
                              {formatDate(section.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
