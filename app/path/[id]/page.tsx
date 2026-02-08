"use client"

import { notFound, redirect } from "next/navigation"
import { useLearningData } from "@/lib/mock-data-context"
import { use, useEffect } from "react"

export default function LearningPathPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { paths } = useLearningData()

  const path = paths.find((p) => p.id === id)

  if (!path) {
    notFound()
  }

  useEffect(() => {
    // Find first incomplete section
    let firstIncompleteSection = null

    for (const unit of path.units) {
      for (const section of unit.sections) {
        if (!section.isCompleted && section.isUnlocked) {
          firstIncompleteSection = section
          break
        }
      }
      if (firstIncompleteSection) break
    }

    // If found, redirect to it
    if (firstIncompleteSection) {
      window.location.href = `/path/${id}/section/${firstIncompleteSection.id}`
    } else {
      // All complete or none unlocked - go to first section
      const firstSection = path.units[0]?.sections[0]
      if (firstSection) {
        window.location.href = `/path/${id}/section/${firstSection.id}`
      }
    }
  }, [id, path])

  return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  )
}
