"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useLearningData, type LogEntry } from "@/lib/mock-data-context"

interface LearningLogFormProps {
  editingEntry?: LogEntry
  onCancel: () => void
}

export function LearningLogForm({ editingEntry, onCancel }: LearningLogFormProps) {
  const { paths, addLogEntry, updateLogEntry } = useLearningData()

  const [date, setDate] = useState<Date>(new Date())
  const [pathId, setPathId] = useState<string>(paths[0]?.id || "")
  const [content, setContent] = useState<string>("")

  // Pre-populate form when editing
  useEffect(() => {
    if (editingEntry) {
      setDate(new Date(editingEntry.date))
      setPathId(editingEntry.pathId)
      setContent(editingEntry.content)
    }
  }, [editingEntry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!pathId || !content.trim()) {
      return
    }

    const selectedPath = paths.find((p) => p.id === pathId)
    if (!selectedPath) return

    const dateString = date.toISOString().split("T")[0]

    if (editingEntry) {
      updateLogEntry(editingEntry.id, content)
      onCancel()
    } else {
      addLogEntry({
        pathId,
        pathName: selectedPath.name,
        date: dateString,
        content,
      })
      // Reset form
      setDate(new Date())
      setPathId(paths[0]?.id || "")
      setContent("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-md p-4 space-y-4">
      <div className="flex gap-4">
        {/* Date Picker */}
        <div className="flex-1">
          <label className="text-sm font-medium block mb-2">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Learning Path Selector */}
        <div className="flex-1">
          <label htmlFor="path-select" className="text-sm font-medium block mb-2">
            Learning Path
          </label>
          <select
            id="path-select"
            value={pathId}
            onChange={(e) => setPathId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {paths.map((path) => (
              <option key={path.id} value={path.id}>
                {path.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Text Area */}
      <div>
        <label htmlFor="content" className="text-sm font-medium block mb-2">
          What did you work on?
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe what you learned or accomplished today..."
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <Button type="submit" disabled={!pathId || !content.trim()}>
          {editingEntry ? "Update Entry" : "Add Entry"}
        </Button>
        {editingEntry && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
