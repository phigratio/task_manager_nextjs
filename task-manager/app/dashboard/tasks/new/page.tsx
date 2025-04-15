import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TaskForm } from "@/components/task-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/lib/models"

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  await connectToDatabase()

  // Fetch categories for the current user
  const categories = await Category.find({ userId: session.user.id })

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Task</h1>
          <TaskForm categories={categories} />
        </div>
      </main>
    </div>
  )
}
