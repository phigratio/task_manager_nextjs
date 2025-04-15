import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Task } from "@/lib/models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, dueDate, priority, status, category } = await request.json()

    // Validate input
    if (!title || !description || !dueDate || !priority || !status || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Create new task
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      category,
      userId: session.user.id,
    })

    await newTask.save()

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("Task creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const priority = url.searchParams.get("priority")
    const category = url.searchParams.get("category")
    const search = url.searchParams.get("search")

    // Build query
    const query: any = { userId: session.user.id }

    if (status) query.status = status
    if (priority) query.priority = priority
    if (category) query.category = category
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Get tasks
    const tasks = await Task.find(query).sort({ createdAt: -1 })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Task fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
