"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DeadlinePickerProps {
  deadline: string | null
  onDeadlineChange: (deadline: string | null) => void
  placeholder?: string
}

export function DeadlinePicker({
  deadline,
  onDeadlineChange,
  placeholder = "Set deadline",
}: DeadlinePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    deadline ? new Date(deadline) : undefined
  )

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      onDeadlineChange(selectedDate.toISOString().split("T")[0])
    } else {
      onDeadlineChange(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          size="sm"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
