import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Mock data for now - will replace with Supabase queries
const mockData = {
  weeklyAgenda: [
    {
      id: "1",
      name: "1A: US Geography",
      code: "1A",
      deadline: "2026-02-16",
      pathName: "Applied Geography",
      daysUntil: 9,
      completed: false,
    },
  ],
  learningPaths: [
    {
      id: "1",
      name: "Applied Geography",
      description: "A practical curriculum for building geographic literacy",
      totalSections: 14,
      completedSections: 0,
      currentSection: "1A: US Geography",
      progress: 0,
    },
  ],
}

function getDaysUntilText(days: number) {
  if (days < 0) return "Overdue"
  if (days === 0) return "Due today"
  if (days === 1) return "Due tomorrow"
  return `Due in ${days} days`
}

export default function Home() {
  const { weeklyAgenda, learningPaths } = mockData

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-8 px-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Weekly Overview</h1>
          <p className="text-muted-foreground mt-2">
            Your upcoming deadlines and learning progress
          </p>
        </div>

        {/* Weekly Agenda */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">This Week</h2>
          {weeklyAgenda.length > 0 ? (
            <div className="grid gap-4">
              {weeklyAgenda.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.pathName}</CardDescription>
                      </div>
                      <Badge variant={item.daysUntil < 3 ? "destructive" : "secondary"}>
                        {getDaysUntilText(item.daysUntil)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button asChild variant="default" size="sm">
                        <Link href={`/path/applied-geography/section/${item.id}`}>Continue</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No upcoming deadlines this week. You're all caught up!
              </CardContent>
            </Card>
          )}
        </section>

        {/* Learning Paths Overview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Learning Paths</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/paths/new">Add Path</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {learningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{path.name}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {path.completedSections} / {path.totalSections} sections
                      </span>
                    </div>
                    <Progress value={path.progress} />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-medium">{path.currentSection}</span>
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/path/${path.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
