"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
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
  completedDate: string | null
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

export interface LogEntry {
  id: string
  pathId: string
  pathName: string
  date: string
  content: string
  createdAt: string
  updatedAt: string
}

interface LearningDataContextType {
  paths: LearningPath[]
  logEntries: LogEntry[]
  updateSectionDeadline: (pathId: string, sectionId: string, deadline: string | null) => void
  toggleTopic: (pathId: string, sectionId: string, topicId: string) => void
  toggleRequirement: (pathId: string, sectionId: string, reqId: string, childId?: string) => void
  completeSection: (pathId: string, sectionId: string) => void
  getSectionById: (pathId: string, sectionId: string) => Section | undefined
  getWeeklyItems: () => Array<{ section: Section; daysUntil: number }>
  getAllItemsWithDeadlines: () => Array<{ section: Section; daysUntil: number; isNext: boolean }>
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateLogEntry: (id: string, content: string) => void
  deleteLogEntry: (id: string) => void
  getLogEntriesForDate: (date: string) => LogEntry[]
}

const LearningDataContext = createContext<LearningDataContextType | undefined>(undefined)

const STORAGE_KEY = 'learning-tracker-data'
const initialData: LearningPath[] = [appliedGeographyData]

export function LearningDataProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<LearningPath[]>(initialData)
  const [logEntries, setLogEntries] = useState<LogEntry[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after initial mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setPaths(data.paths || data) // Backward compatible
        setLogEntries(data.logEntries || [])
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Persist to localStorage whenever paths or logEntries change (but skip initial hydration)
  useEffect(() => {
    if (!isHydrated) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ paths, logEntries }))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }, [paths, logEntries, isHydrated])

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

  const completeSection = (pathId: string, sectionId: string) => {
    setPaths((prev) =>
      prev.map((path) => {
        if (path.id !== pathId) return path

        return {
          ...path,
          units: path.units.map((unit) => ({
            ...unit,
            sections: unit.sections.map((section, index) => {
              if (section.id === sectionId) {
                // Mark this section complete
                return {
                  ...section,
                  isCompleted: true,
                  completedDate: new Date().toISOString(),
                }
              }
              // Unlock next section if this is the previous one
              const prevSection = unit.sections[index - 1]
              if (prevSection?.id === sectionId && !section.isUnlocked) {
                return { ...section, isUnlocked: true }
              }
              return section
            }),
          })),
        }
      })
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
    const twoWeeksFromNow = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
    const items: Array<{ section: Section; daysUntil: number }> = []

    paths.forEach((path) => {
      path.units.forEach((unit) => {
        unit.sections.forEach((section) => {
          if (section.deadline && !section.isCompleted) {
            const deadline = new Date(section.deadline)
            const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            // Include if due within the next two weeks or overdue
            if (deadline <= twoWeeksFromNow || daysUntil < 0) {
              items.push({ section, daysUntil })
            }
          }
        })
      })
    })

    return items.sort((a, b) => a.daysUntil - b.daysUntil)
  }

  const getAllItemsWithDeadlines = () => {
    const today = new Date()
    const allItems: Array<{ section: Section; daysUntil: number; isNext: boolean }> = []

    // Get next item for each path
    const nextItemPerPath = new Map<string, string>()

    paths.forEach((path) => {
      let nextSection: Section | null = null
      let minDaysUntil = Infinity

      path.units.forEach((unit) => {
        unit.sections.forEach((section) => {
          if (section.deadline && !section.isCompleted) {
            const deadline = new Date(section.deadline)
            const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            if (daysUntil < minDaysUntil) {
              minDaysUntil = daysUntil
              nextSection = section
            }
          }
        })
      })

      if (nextSection) {
        nextItemPerPath.set(path.id, nextSection.id)
      }
    })

    // Collect all items with deadlines
    paths.forEach((path) => {
      path.units.forEach((unit) => {
        unit.sections.forEach((section) => {
          if (section.deadline && !section.isCompleted) {
            const deadline = new Date(section.deadline)
            const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            const isNext = nextItemPerPath.get(path.id) === section.id

            allItems.push({ section, daysUntil, isNext })
          }
        })
      })
    })

    return allItems.sort((a, b) => a.daysUntil - b.daysUntil)
  }

  const addLogEntry = (entry: Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newEntry: LogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    setLogEntries((prev) => [...prev, newEntry])
  }

  const updateLogEntry = (id: string, content: string) => {
    setLogEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? { ...entry, content, updatedAt: new Date().toISOString() }
          : entry
      )
    )
  }

  const deleteLogEntry = (id: string) => {
    setLogEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const getLogEntriesForDate = (date: string) => {
    return logEntries.filter((entry) => entry.date === date)
  }

  return (
    <LearningDataContext.Provider
      value={{
        paths,
        logEntries,
        updateSectionDeadline,
        toggleTopic,
        toggleRequirement,
        completeSection,
        getSectionById,
        getWeeklyItems,
        getAllItemsWithDeadlines,
        addLogEntry,
        updateLogEntry,
        deleteLogEntry,
        getLogEntriesForDate,
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
