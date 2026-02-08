"use client"

import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle2, Circle, Lock } from "lucide-react"
import { useLearningData } from "@/lib/mock-data-context"
import { use } from "react"
import { format } from "date-fns"

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
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Learning Path</h2>

          {path.units.map((unit, unitIndex) => (
            <Card key={unit.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Unit {unitIndex + 1}: {unit.name}</CardTitle>
                    {unit.completeBy && (
                      <CardDescription>Complete by {formatDate(unit.completeBy)}</CardDescription>
                    )}
                  </div>
                  <Badge variant="outline">
                    {unit.sections.filter((s) => s.isCompleted).length} / {unit.sections.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {unit.sections.map((section) => {
                    const daysUntil = section.deadline ? getDaysUntil(section.deadline) : null
                    const isOverdue = daysUntil !== null && daysUntil < 0
                    const isDueSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7

                    const topicsCompleted = section.topics.filter((t) => t.completed).length
                    const topicsTotal = section.topics.length
                    const requirementsMet = section.progressionRequirements.filter((r) => r.completed).length
                    const requirementsTotal = section.progressionRequirements.length

                    return (
                      <AccordionItem key={section.id} value={section.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-3">
                              {section.isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : section.isUnlocked ? (
                                <Circle className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {section.code}
                                  </Badge>
                                  <span className="font-medium">{section.name}</span>
                                </div>
                                {section.deadline && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Due {formatDate(section.deadline)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!section.isUnlocked && <Badge variant="secondary">Locked</Badge>}
                              {section.isUnlocked && !section.isCompleted && isOverdue && (
                                <Badge variant="destructive">Overdue</Badge>
                              )}
                              {section.isUnlocked && !section.isCompleted && isDueSoon && (
                                <Badge variant="destructive">Due Soon</Badge>
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-8 pt-2 space-y-4">
                            {!section.isUnlocked && (
                              <div className="p-4 bg-muted rounded-lg text-sm">
                                <p className="font-medium mb-1">Section Locked</p>
                                <p className="text-muted-foreground">
                                  Complete all progression requirements in the previous section to unlock this one.
                                </p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Topics: </span>
                                <span className="font-medium">
                                  {topicsCompleted} / {topicsTotal}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Requirements: </span>
                                <span className="font-medium">
                                  {requirementsMet} / {requirementsTotal}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button asChild size="sm" disabled={!section.isUnlocked}>
                                <Link href={`/path/${id}/section/${section.id}`}>
                                  {section.isCompleted ? "Review" : "Start Section"}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
