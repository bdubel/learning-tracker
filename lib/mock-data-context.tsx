"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { appliedGeographyData } from "./applied-geography-data"

export interface Topic {
  id: string
  content: string
  completed: boolean
}

export interface ProgressionRequirement {
  id: string
  content: string
  completed: boolean
  children?: Array<{ id: string; content: string; completed: boolean }>
}

export interface Resource {
  id: string
  name: string
  url: string | null
  description: string | null
}

export interface Section {
  id: string
  name: string
  code: string
  deadline: string | null
  pathId: string
  pathName: string
  unitId: string
  isUnlocked: boolean
  isCompleted: boolean
  topics: Topic[]
  resources: Resource[]
  progressionRequirements: ProgressionRequirement[]
}

export interface Unit {
  id: string
  name: string
  completeBy: string | null
  sections: Section[]
}

export interface LearningPath {
  id: string
  name: string
  description: string
  units: Unit[]
}

interface LearningDataContextType {
  paths: LearningPath[]
  updateSectionDeadline: (pathId: string, sectionId: string, deadline: string | null) => void
  toggleTopic: (pathId: string, sectionId: string, topicId: string) => void
  toggleRequirement: (pathId: string, sectionId: string, reqId: string, childId?: string) => void
  getSectionById: (pathId: string, sectionId: string) => Section | undefined
  getWeeklyItems: () => Array<{ section: Section; daysUntil: number }>
}

const LearningDataContext = createContext<LearningDataContextType | undefined>(undefined)

const initialData: LearningPath[] = [appliedGeographyData]

export function LearningDataProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<LearningPath[]>(initialData)

  const updateSectionDeadline = (pathId: string, sectionId: string, deadline: string | null) => {
    setPaths((prev) =>
      prev.map((path) =>
        path.id === pathId
          ? {
              ...path,
              units: path.units.map((unit) => ({
                ...unit,
                sections: unit.sections.map((section) =>
                  section.id === sectionId ? { ...section, deadline } : section
                ),
              })),
            }
          : path
      )
    )
  }

  const toggleTopic = (pathId: string, sectionId: string, topicId: string) => {
    setPaths((prev) =>
      prev.map((path) =>
        path.id === pathId
          ? {
              ...path,
              units: path.units.map((unit) => ({
                ...unit,
                sections: unit.sections.map((section) =>
                  section.id === sectionId
                    ? {
                        ...section,
                        topics: section.topics.map((topic) =>
                          topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
                        ),
                      }
                    : section
                ),
              })),
            }
          : path
      )
    )
  }

  const toggleRequirement = (pathId: string, sectionId: string, reqId: string, childId?: string) => {
    setPaths((prev) =>
      prev.map((path) =>
        path.id === pathId
          ? {
              ...path,
              units: path.units.map((unit) => ({
                ...unit,
                sections: unit.sections.map((section) =>
                  section.id === sectionId
                    ? {
                        ...section,
                        progressionRequirements: section.progressionRequirements.map((req) => {
                          if (req.id === reqId) {
                            if (childId && req.children) {
                              const updatedChildren = req.children.map((child) =>
                                child.id === childId ? { ...child, completed: !child.completed } : child
                              )
                              const allChildrenComplete = updatedChildren.every((c) => c.completed)
                              return { ...req, children: updatedChildren, completed: allChildrenComplete }
                            }
                            return { ...req, completed: !req.completed }
                          }
                          return req
                        }),
                      }
                    : section
                ),
              })),
            }
          : path
      )
    )
  }

  const getSectionById = (pathId: string, sectionId: string): Section | undefined => {
    const path = paths.find((p) => p.id === pathId)
    if (!path) return undefined

    for (const unit of path.units) {
      const section = unit.sections.find((s) => s.id === sectionId)
      if (section) return section
    }
    return undefined
  }

  const getWeeklyItems = () => {
    const today = new Date()
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const items: Array<{ section: Section; daysUntil: number }> = []

    paths.forEach((path) => {
      path.units.forEach((unit) => {
        unit.sections.forEach((section) => {
          if (section.deadline && !section.isCompleted) {
            const deadline = new Date(section.deadline)
            const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            // Include if due within the next week or overdue
            if (deadline <= weekFromNow || daysUntil < 0) {
              items.push({ section, daysUntil })
            }
          }
        })
      })
    })

    return items.sort((a, b) => a.daysUntil - b.daysUntil)
  }

  return (
    <LearningDataContext.Provider
      value={{
        paths,
        updateSectionDeadline,
        toggleTopic,
        toggleRequirement,
        getSectionById,
        getWeeklyItems,
      }}
    >
      {children}
    </LearningDataContext.Provider>
  )
}

export function useLearningData() {
  const context = useContext(LearningDataContext)
  if (!context) {
    throw new Error("useLearningData must be used within LearningDataProvider")
  }
  return context
}
