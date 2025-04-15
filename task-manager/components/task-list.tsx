"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Search, Calendar, Clock, Tag } from "lucide-react"

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

interface TaskListProps {
  tasks: Task[]
  categories: Category[]
}

export function TaskList({ tasks: initialTasks, categories }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")

  const router = useRouter()
  const { toast } = useToast()

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((task) => task.category === categoryFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    setFilteredTasks(result)
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy])

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Handle task status change
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus as any } : task)),
        )

        toast({
          title: "Task updated",
          description: "Task status has been updated successfully.",
        })
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "pending":
        return "bg-slate-100 text-slate-800 hover:bg-slate-200"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200"
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId)
    return category ? category.name : categoryId
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-slate-900 mb-2">No tasks found</h3>
          <p className="text-slate-500 mb-6">
            {tasks.length === 0
              ? "You don't have any tasks yet. Create your first task to get started."
              : "No tasks match your current filters. Try adjusting your search or filters."}
          </p>
          {tasks.length === 0 && (
            <Button asChild>
              <Link href="/dashboard/tasks/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Task
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-slate-900 line-clamp-1">{task.title}</h3>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </div>

                <p className="text-slate-500 mb-4 line-clamp-2">{task.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Due: {formatDate(task.dueDate)}</span>
                  </div>

                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Status: </span>
                    <Badge className={`ml-2 ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center text-sm text-slate-500">
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Category: {getCategoryName(task.category)}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 px-6 py-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/tasks/${task._id}`)}>
                  View Details
                </Button>

                <Select value={task.status} onValueChange={(value) => handleStatusChange(task._id, value)}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
