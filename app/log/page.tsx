"use client"

import { useState } from "react"
import { useLearningData } from "@/lib/mock-data-context"
import { LearningLogForm } from "@/components/learning-log-form"
import { LogEntriesList } from "@/components/log-entries-list"

export default function LearningLogPage() {
  const { logEntries } = useLearningData()
  const [editingId, setEditingId] = useState<string | null>(null)

  const editingEntry = editingId ? logEntries.find((e) => e.id === editingId) : undefined

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto py-6 px-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Learning Log</h1>
          <p className="text-sm text-muted-foreground">Track your daily progress and insights</p>
        </div>

        {/* Add Entry Form */}
        <div className="mb-8">
          <LearningLogForm
            editingEntry={editingEntry}
            onCancel={handleCancelEdit}
          />
        </div>

        {/* Entries List */}
        {logEntries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No learning log entries yet.</p>
            <p className="text-sm mt-1">Start tracking your progress!</p>
          </div>
        ) : (
          <LogEntriesList entries={logEntries} onEdit={handleEdit} />
        )}
      </div>
    </div>
  )
}
