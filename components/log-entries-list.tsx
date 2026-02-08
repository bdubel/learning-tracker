"use client"

import { LogEntry } from "@/lib/mock-data-context"
import { LogEntryCard } from "@/components/log-entry-card"

interface LogEntriesListProps {
  entries: LogEntry[]
  onEdit: (id: string) => void
}

function formatDateHeader(dateString: string): string {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const entryDate = new Date(dateString)

  const todayStr = today.toISOString().split("T")[0]
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  if (dateString === todayStr) {
    return "Today"
  } else if (dateString === yesterdayStr) {
    return "Yesterday"
  } else {
    return entryDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }
}

export function LogEntriesList({ entries, onEdit }: LogEntriesListProps) {
  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = []
    }
    acc[entry.date].push(entry)
    return acc
  }, {} as Record<string, LogEntry[]>)

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {formatDateHeader(date)}
          </h2>
          <div className="space-y-2">
            {entriesByDate[date].map((entry) => (
              <LogEntryCard key={entry.id} entry={entry} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
