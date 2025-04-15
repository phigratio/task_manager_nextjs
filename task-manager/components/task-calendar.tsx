"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { isSameDay, format } from "date-fns"

interface Task {
  _id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  category: string
}

interface Category {
  _id: string
  name: string
}

interface TaskCalendarProps {
  tasks: Task[]
  categories: Category[]
}

export function TaskCalendar({ tasks, categories }: TaskCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const router = useRouter()

  // Get tasks for selected date
  const getTasksForDate = (date: Date | undefined) => {
    if (!date) return []

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId)
    return category ? category.name : categoryId
  }

  // Get dates with tasks for calendar highlighting
  const getDatesWithTasks = () => {
    const dates: Date[] = []

    tasks.forEach((task) => {
      const date = new Date(task.dueDate)
      if (!dates.some((d) => isSameDay(d, date))) {
        dates.push(date)
      }
    })

    return dates
  }

  const tasksForSelectedDate = getTasksForDate(selectedDate)
  const datesWithTasks = getDatesWithTasks()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasTasks: datesWithTasks,
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
              </h2>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
            </div>

            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">No tasks due on this date</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer"
                      onClick={() => router.push(`/dashboard/tasks/${task._id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{getCategoryName(task.category)}</Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status.replace("-", " ")}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
