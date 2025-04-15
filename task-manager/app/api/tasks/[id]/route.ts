import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Task } from "@/lib/models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id

    await connectToDatabase()

    const task = await Task.findOne({
      _id: taskId,
      userId: session.user.id,
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Task fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id
    const updates = await request.json()

    await connectToDatabase()

    // Find task and verify ownership
    const task = await Task.findOne({
      _id: taskId,
      userId: session.user.id,
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updates }, { new: true })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Task update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id

    await connectToDatabase()

    // Find task and verify ownership
    const task = await Task.findOne({
      _id: taskId,
      userId: session.user.id,
    })

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 })
    }

    // Delete task
    await Task.findByIdAndDelete(taskId)

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Task deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
