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

// Mock data - will replace with Supabase queries
const mockPath = {
  id: "1",
  name: "Applied Geography",
  description: "A practical curriculum for building geographic literacy. Focus on mastery—don't move to the next section until you meet the progression requirements.",
  duration: "~7 months",
  effort: "~1.5 hours/week",
  totalSections: 14,
  completedSections: 0,
  units: [
    {
      id: "unit-1",
      name: "Foundation",
      completeBy: "2026-04-02",
      sections: [
        {
          id: "section-1a",
          name: "1A: US Geography",
          code: "1A",
          deadline: "2026-02-16",
          isUnlocked: true,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 6,
          requirementsMet: 0,
          requirementsTotal: 7,
        },
        {
          id: "section-1b",
          name: "1B: World Regions Mental Model",
          code: "1B",
          deadline: "2026-02-28",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 5,
          requirementsMet: 0,
          requirementsTotal: 4,
        },
        {
          id: "section-1c",
          name: "1C: Core Countries—Europe & Americas",
          code: "1C",
          deadline: "2026-03-16",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 4,
          requirementsMet: 0,
          requirementsTotal: 5,
        },
        {
          id: "section-1d",
          name: "1D: Core Countries—Middle East & Africa",
          code: "1D",
          deadline: "2026-04-02",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 4,
          requirementsMet: 0,
          requirementsTotal: 5,
        },
      ],
    },
    {
      id: "unit-2",
      name: "Strategic Geography",
      completeBy: "2026-06-08",
      sections: [
        {
          id: "section-2a",
          name: "2A: Chokepoints & Trade Routes",
          code: "2A",
          deadline: "2026-04-16",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 5,
          requirementsMet: 0,
          requirementsTotal: 4,
        },
        {
          id: "section-2b",
          name: "2B: Asia-Pacific",
          code: "2B",
          deadline: "2026-05-04",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 5,
          requirementsMet: 0,
          requirementsTotal: 4,
        },
        {
          id: "section-2c",
          name: "2C: Russia, Eastern Europe & Central Asia",
          code: "2C",
          deadline: "2026-05-20",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 5,
          requirementsMet: 0,
          requirementsTotal: 4,
        },
        {
          id: "section-2d",
          name: "2D: Resources & Economic Geography",
          code: "2D",
          deadline: "2026-06-08",
          isUnlocked: false,
          isCompleted: false,
          progressionMet: false,
          topicsCompleted: 0,
          topicsTotal: 5,
          requirementsMet: 0,
          requirementsTotal: 4,
        },
      ],
    },
  ],
  weeklyRhythm: [
    { day: "Sunday", activity: "New topic reading/videos", time: "45 min" },
    { day: "Wednesday", activity: "Seterra or map practice", time: "20 min" },
    { day: "Friday", activity: "Review + news connection", time: "25 min" },
  ],
}

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

export default function LearningPathPage({ params }: { params: { id: string } }) {
  const path = mockPath

  if (!path) {
    notFound()
  }

  const progressPercentage = (path.completedSections / path.totalSections) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/">← Back to Dashboard</Link>
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{path.name}</h1>
              <p className="text-muted-foreground mt-2 max-w-3xl">{path.description}</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Duration: {path.duration}</span>
            <span>•</span>
            <span>Effort: {path.effort}</span>
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
                  {path.completedSections} / {path.totalSections}
                </span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Rhythm */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weekly Rhythm</CardTitle>
            <CardDescription>Recommended practice schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {path.weeklyRhythm.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium min-w-24">{item.day}</span>
                    <span className="text-muted-foreground">{item.activity}</span>
                  </div>
                  <Badge variant="secondary">{item.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Units and Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Learning Path</h2>

          {path.units.map((unit) => (
            <Card key={unit.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{unit.name}</CardTitle>
                    <CardDescription>Complete by {formatDate(unit.completeBy)}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {unit.sections.filter(s => s.isCompleted).length} / {unit.sections.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {unit.sections.map((section) => {
                    const daysUntil = getDaysUntil(section.deadline)
                    const isOverdue = daysUntil < 0
                    const isDueSoon = daysUntil >= 0 && daysUntil <= 7

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
                                <div className="font-medium">{section.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  Due {formatDate(section.deadline)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!section.isUnlocked && (
                                <Badge variant="secondary">Locked</Badge>
                              )}
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
                                  {section.topicsCompleted} / {section.topicsTotal}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Requirements: </span>
                                <span className="font-medium">
                                  {section.requirementsMet} / {section.requirementsTotal}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                asChild
                                size="sm"
                                disabled={!section.isUnlocked}
                              >
                                <Link href={`/section/${section.id}`}>
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
