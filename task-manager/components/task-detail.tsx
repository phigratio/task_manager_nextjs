"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, Tag, Edit, Trash, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TaskForm } from "@/components/task-form"

interface Task {
  _id: string
  title: string
  description: string
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  category: string
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  name: string
}

interface TaskDetailProps {
  task: Task
  categories: Category[]
}

export function TaskDetail({ task, categories }: TaskDetailProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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

  // Handle task deletion
  const handleDeleteTask = async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }

      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      {isEditMode ? (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setIsEditMode(false)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
          <TaskForm task={task} categories={categories} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 whitespace-pre-line">{task.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Due Date: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Tag className="mr-2 h-4 w-4" />
                      <span>Category: {getCategoryName(task.category)}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Created: {formatDate(task.createdAt)}</span>
                    </div>
                    {task.updatedAt !== task.createdAt && (
                      <div className="flex items-center text-slate-600">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Last Updated: {formatDate(task.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 px-6 py-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditMode(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </Button>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteTask} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete Task"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
