import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskList } from "@/components/task-list"
import { connectToDatabase } from "@/lib/mongodb"
import { Task, Category } from "@/lib/models"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskStats } from "@/components/task-stats"
import { CategoryList } from "@/components/category-list"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await connectToDatabase()

  // Fetch tasks for the current user
  const tasks = await Task.find({ userId: session.user.id }).sort({ createdAt: -1 })

  // Fetch categories for the current user
  const categories = await Category.find({ userId: session.user.id })

  // Calculate task statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length

  // Get tasks due today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const tasksDueToday = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <TaskStats title="Total Tasks" count={totalTasks} icon="clipboard-list" color="bg-blue-100 text-blue-600" />
          <TaskStats title="Completed" count={completedTasks} icon="check-circle" color="bg-green-100 text-green-600" />
          <TaskStats title="In Progress" count={inProgressTasks} icon="clock" color="bg-yellow-100 text-yellow-600" />
          <TaskStats title="Pending" count={pendingTasks} icon="alert-circle" color="bg-red-100 text-red-600" />
        </div>

        <Tabs defaultValue="all-tasks" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all-tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="due-today">Due Today</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="all-tasks">
            <TaskList tasks={tasks} categories={categories} />
          </TabsContent>

          <TabsContent value="due-today">
            <TaskList tasks={tasksDueToday} categories={categories} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryList categories={categories} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
