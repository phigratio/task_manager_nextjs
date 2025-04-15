import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskCalendar } from "@/components/task-calendar"
import { connectToDatabase } from "@/lib/mongodb"
import { Task, Category } from "@/lib/models"

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await connectToDatabase()

  // Fetch tasks for the current user
  const tasks = await Task.find({ userId: session.user.id })

  // Fetch categories for the current user
  const categories = await Category.find({ userId: session.user.id })

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Calendar View</h1>

        <TaskCalendar tasks={JSON.parse(JSON.stringify(tasks))} categories={categories} />
      </main>
    </div>
  )
}
