"use client"

import { use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"
import { useLearningData } from "@/lib/mock-data-context"
import { DeadlinePicker } from "@/components/deadline-picker"


function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function getDaysUntil(dateString: string) {
  const today = new Date()
  const deadline = new Date(dateString)
  const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function SectionPage({ params }: { params: Promise<{ id: string; sectionId: string }> }) {
  const { id, sectionId } = use(params)
  const { getSectionById, toggleTopic, toggleRequirement, updateSectionDeadline } = useLearningData()

  const section = getSectionById(id, sectionId)

  if (!section) {
    return <div className="flex-1 flex items-center justify-center">Section not found</div>
  }

  const handleTopicToggle = (topicId: string) => {
    toggleTopic(id, sectionId, topicId)
  }

  const handleRequirementToggle = (reqId: string, childId?: string) => {
    toggleRequirement(id, sectionId, reqId, childId)
  }

  const handleDeadlineChange = (deadline: string | null) => {
    updateSectionDeadline(id, sectionId, deadline)
  }

  const topicsCompleted = section.topics.filter(t => t.completed).length
  const topicsTotal = section.topics.length
  const topicsProgress = (topicsCompleted / topicsTotal) * 100

  const requirementsCompleted = section.progressionRequirements.filter(r => r.completed).length
  const requirementsTotal = section.progressionRequirements.length
  const requirementsProgress = (requirementsCompleted / requirementsTotal) * 100

  const allRequirementsMet = requirementsCompleted === requirementsTotal

  const daysUntil = getDaysUntil(section.deadline)
  const isOverdue = daysUntil < 0
  const isDueSoon = daysUntil >= 0 && daysUntil <= 7

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight mb-3">{section.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                {isDueSoon && !isOverdue && <Badge variant="destructive">Due Soon</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <DeadlinePicker
                  deadline={section.deadline}
                  onDeadlineChange={handleDeadlineChange}
                  placeholder="Set deadline"
                />
                {section.deadline && daysUntil >= 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({daysUntil} days remaining)
                  </span>
                )}
                {section.deadline && daysUntil < 0 && (
                  <span className="text-sm text-destructive">
                    ({Math.abs(daysUntil)} days overdue)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Alert */}
        {allRequirementsMet && (
          <Alert className="mb-6 border-green-600 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">Ready to Progress!</AlertTitle>
            <AlertDescription className="text-green-800">
              You've completed all progression requirements. You can now move to the next section.
            </AlertDescription>
          </Alert>
        )}

        {/* Topics */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Topics to Learn</CardTitle>
                <CardDescription>Track your learning progress</CardDescription>
              </div>
              <span className="text-sm font-medium">
                {topicsCompleted} / {topicsTotal}
              </span>
            </div>
            <Progress value={topicsProgress} className="mt-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.topics.map((topic) => (
                <div key={topic.id} className="flex items-start gap-3 py-2">
                  <Checkbox
                    id={topic.id}
                    checked={topic.completed}
                    onCheckedChange={() => handleTopicToggle(topic.id)}
                    className="mt-1"
                  />
                  <label
                    htmlFor={topic.id}
                    className={`text-sm leading-relaxed cursor-pointer ${
                      topic.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {topic.content}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Helpful materials for this section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.resources.map((resource) => (
                <div key={resource.id} className="flex items-start justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{resource.name}</div>
                    {resource.description && (
                      <div className="text-sm text-muted-foreground">{resource.description}</div>
                    )}
                  </div>
                  {resource.url && (
                    <Button asChild variant="ghost" size="sm">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progression Requirements */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Progression Requirements
                  {!allRequirementsMet && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                  {allRequirementsMet && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                </CardTitle>
                <CardDescription>
                  Complete all requirements to unlock the next section
                </CardDescription>
              </div>
              <span className="text-sm font-medium">
                {requirementsCompleted} / {requirementsTotal}
              </span>
            </div>
            <Progress value={requirementsProgress} className="mt-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.progressionRequirements.map((req) => (
                <div key={req.id} className="space-y-2">
                  <div className="flex items-start gap-3 py-2">
                    <Checkbox
                      id={req.id}
                      checked={req.completed}
                      onCheckedChange={() => handleRequirementToggle(req.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={req.id}
                      className={`text-sm leading-relaxed cursor-pointer font-medium ${
                        req.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {req.content}
                    </label>
                  </div>
                  {req.children && (
                    <div className="ml-8 space-y-2">
                      {req.children.map((child) => (
                        <div key={child.id} className="flex items-start gap-3 py-1">
                          <Checkbox
                            id={child.id}
                            checked={child.completed}
                            onCheckedChange={() => handleRequirementToggle(req.id, child.id)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={child.id}
                            className={`text-sm leading-relaxed cursor-pointer ${
                              child.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {child.content}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-8">
          <Button disabled={!allRequirementsMet}>
            {allRequirementsMet ? "Complete Section & Unlock Next" : "Complete All Requirements First"}
          </Button>
        </div>
      </div>
    </div>
  )
}
