import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskDetail } from "@/components/task-detail"
import { connectToDatabase } from "@/lib/mongodb"
import { Task, Category } from "@/lib/models"

export default async function TaskDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await connectToDatabase()

  // Fetch task
  const task = await Task.findOne({
    _id: params.id,
    userId: session.user.id,
  })

  if (!task) {
    redirect("/dashboard")
  }

  // Fetch categories
  const categories = await Category.find({ userId: session.user.id })

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Task Details</h1>
          <TaskDetail task={JSON.parse(JSON.stringify(task))} categories={categories} />
        </div>
      </main>
    </div>
  )
}
