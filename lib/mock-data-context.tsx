"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

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

const initialData: LearningPath[] = [
  {
    id: "applied-geography",
    name: "Applied Geography",
    description: "A practical curriculum for building geographic literacy",
    units: [
      {
        id: "unit-1",
        name: "Foundation",
        completeBy: "2026-04-02",
        sections: [
          {
            id: "section-1a",
            name: "US Geography",
            code: "1A",
            deadline: "2026-02-16",
            pathId: "applied-geography",
            pathName: "Applied Geography",
            unitId: "unit-1",
            isUnlocked: true,
            isCompleted: false,
            topics: [
              { id: "1", content: "50 states spatially (use Seterra until you can do it without hints)", completed: false },
              { id: "2", content: "Major mountain ranges: Rockies, Appalachians, Sierra Nevada, Cascades, Great Plains", completed: false },
              { id: "3", content: "Major rivers: Mississippi system (including Missouri and Ohio tributaries), Colorado, Columbia, Rio Grande", completed: false },
              { id: "4", content: "Why major cities are where they are (ports, rivers, passes, resources)", completed: false },
              { id: "5", content: "Major military installations and their geographic logic", completed: false },
              { id: "6", content: "Basic terrain of each US region", completed: false },
            ],
            resources: [
              { id: "1", name: "Seterra", url: "https://seterra.com", description: "Free browser-based map quizzes" },
              { id: "2", name: "Blank US maps", url: null, description: "To sketch on" },
            ],
            progressionRequirements: [
              { id: "1", content: "Complete a blank US map quiz (all 50 states) in under 3 minutes with 100% accuracy", completed: false },
              { id: "2", content: "Sketch from memory: Rockies, Appalachians, Sierra Nevada, Cascades, Great Plains", completed: false },
              { id: "3", content: "Trace major river systems on a blank map", completed: false },
              {
                id: "4",
                content: "Explain why these cities are where they are:",
                completed: false,
                children: [
                  { id: "4a", content: "New York (harbor + Hudson River access)", completed: false },
                  { id: "4b", content: "Chicago (Great Lakes + rail hub)", completed: false },
                  { id: "4c", content: "New Orleans (Mississippi mouth)", completed: false },
                  { id: "4d", content: "Los Angeles (port + imported water)", completed: false },
                  { id: "4e", content: "Denver (gateway to Rockies)", completed: false },
                  { id: "4f", content: "St. Louis (Mississippi/Missouri confluence)", completed: false },
                ],
              },
            ],
          },
          {
            id: "section-1b",
            name: "World Regions Mental Model",
            code: "1B",
            deadline: "2026-02-28",
            pathId: "applied-geography",
            pathName: "Applied Geography",
            unitId: "unit-1",
            isUnlocked: false,
            isCompleted: false,
            topics: [
              { id: "1", content: "Learn major world regions and their boundaries", completed: false },
              { id: "2", content: "Understand regional characteristics", completed: false },
            ],
            resources: [],
            progressionRequirements: [
              { id: "1", content: "Identify all major world regions on a blank map", completed: false },
            ],
          },
          {
            id: "section-1c",
            name: "Core Countries—Europe & Americas",
            code: "1C",
            deadline: "2026-03-16",
            pathId: "applied-geography",
            pathName: "Applied Geography",
            unitId: "unit-1",
            isUnlocked: false,
            isCompleted: false,
            topics: [
              { id: "1", content: "European countries and capitals", completed: false },
              { id: "2", content: "Americas geography", completed: false },
            ],
            resources: [],
            progressionRequirements: [
              { id: "1", content: "Label all European countries", completed: false },
            ],
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
            name: "Chokepoints & Trade Routes",
            code: "2A",
            deadline: null,
            pathId: "applied-geography",
            pathName: "Applied Geography",
            unitId: "unit-2",
            isUnlocked: false,
            isCompleted: false,
            topics: [
              { id: "1", content: "Major global chokepoints", completed: false },
            ],
            resources: [],
            progressionRequirements: [
              { id: "1", content: "Identify and explain 10 major chokepoints", completed: false },
            ],
          },
        ],
      },
    ],
  },
]

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
