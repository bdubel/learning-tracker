"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react"

// Mock data - will replace with Supabase queries
const mockSection = {
  id: "section-1a",
  name: "1A: US Geography",
  code: "1A",
  deadline: "2026-02-16",
  pathName: "Applied Geography",
  pathId: "1",
  topics: [
    { id: "1", content: "50 states spatially (use Seterra until you can do it without hints)", completed: false },
    { id: "2", content: "Major mountain ranges: Rockies, Appalachians, Sierra Nevada, Cascades, Great Plains", completed: false },
    { id: "3", content: "Major rivers: Mississippi system (including Missouri and Ohio tributaries), Colorado, Columbia, Rio Grande", completed: false },
    { id: "4", content: "Why major cities are where they are (ports, rivers, passes, resources)", completed: false },
    { id: "5", content: "Major military installations and their geographic logic", completed: false },
    { id: "6", content: "Basic terrain of each US region: Northeast, Southeast, Midwest, Great Plains, Southwest, Pacific Northwest, Alaska, Hawaii", completed: false },
  ],
  resources: [
    { id: "1", name: "Seterra", url: "https://seterra.com", description: "Free browser-based map quizzes" },
    { id: "2", name: "Blank US maps", url: null, description: "To sketch on" },
  ],
  progressionRequirements: [
    { id: "1", content: "Complete a blank US map quiz (all 50 states) in under 3 minutes with 100% accuracy", completed: false },
    {
      id: "2",
      content: "Sketch from memory the rough shapes and locations of: Rockies, Appalachians, Sierra Nevada, Cascades, Great Plains",
      completed: false
    },
    {
      id: "3",
      content: "Trace the Mississippi River system, the Colorado, the Columbia, and the Rio Grande on a blank map",
      completed: false
    },
    {
      id: "4",
      content: "Explain why these cities are where they are:",
      completed: false,
      children: [
        { id: "4a", content: "New York (harbor + Hudson River access to interior)", completed: false },
        { id: "4b", content: "Chicago (Great Lakes + rail hub + portage point)", completed: false },
        { id: "4c", content: "New Orleans (Mississippi mouth, Gulf access)", completed: false },
        { id: "4d", content: "Los Angeles (port, later water imported)", completed: false },
        { id: "4e", content: "Denver (gateway to Rockies, mining supply point)", completed: false },
        { id: "4f", content: "St. Louis (confluence of Mississippi and Missouri)", completed: false },
      ],
    },
    {
      id: "5",
      content: "Name and roughly locate at least 10 major US military installations and explain the geographic logic of 5 of them",
      completed: false
    },
    { id: "6", content: "Describe the basic terrain of each US region", completed: false },
  ],
}

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

export default function SectionPage({ params }: { params: { id: string } }) {
  const [section, setSection] = useState(mockSection)

  const handleTopicToggle = (topicId: string) => {
    setSection(prev => ({
      ...prev,
      topics: prev.topics.map(t =>
        t.id === topicId ? { ...t, completed: !t.completed } : t
      ),
    }))
  }

  const handleRequirementToggle = (reqId: string, childId?: string) => {
    setSection(prev => ({
      ...prev,
      progressionRequirements: prev.progressionRequirements.map(req => {
        if (req.id === reqId) {
          if (childId && req.children) {
            const updatedChildren = req.children.map(child =>
              child.id === childId ? { ...child, completed: !child.completed } : child
            )
            const allChildrenComplete = updatedChildren.every(c => c.completed)
            return { ...req, children: updatedChildren, completed: allChildrenComplete }
          }
          return { ...req, completed: !req.completed }
        }
        return req
      }),
    }))
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href={`/path/${section.pathId}`}>← Back to {section.pathName}</Link>
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{section.code}</Badge>
                {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                {isDueSoon && !isOverdue && <Badge variant="destructive">Due Soon</Badge>}
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{section.name}</h1>
              <p className="text-muted-foreground mt-2">
                Deadline: {formatDate(section.deadline)}
                {daysUntil >= 0 && ` (${daysUntil} days remaining)`}
                {daysUntil < 0 && ` (${Math.abs(daysUntil)} days overdue)`}
              </p>
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
        <div className="flex justify-end gap-4">
          <Button asChild variant="outline">
            <Link href={`/path/${section.pathId}`}>Back to Path</Link>
          </Button>
          <Button disabled={!allRequirementsMet}>
            {allRequirementsMet ? "Complete Section & Unlock Next" : "Complete All Requirements First"}
          </Button>
        </div>
      </div>
    </div>
  )
}
