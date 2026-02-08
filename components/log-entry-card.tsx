"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogEntry, useLearningData } from "@/lib/mock-data-context"
import { format } from "date-fns"

interface LogEntryCardProps {
  entry: LogEntry
  onEdit: (id: string) => void
}

export function LogEntryCard({ entry, onEdit }: LogEntryCardProps) {
  const { deleteLogEntry } = useLearningData()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteLogEntry(entry.id)
    } else {
      setShowDeleteConfirm(true)
      setTimeout(() => setShowDeleteConfirm(false), 3000)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <div className="py-2 px-3 rounded-md border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-medium text-sm">{entry.pathName}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(entry.createdAt), "PPP 'at' p")}
          </div>
        </div>
      </div>
      <div className="text-sm mb-3 whitespace-pre-wrap">{entry.content}</div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(entry.id)}>
          Edit
        </Button>
        {showDeleteConfirm ? (
          <>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Confirm Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancelDelete}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
