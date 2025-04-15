import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Category, Task } from "@/lib/models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const categoryId = params.id
    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find category and verify ownership
    const category = await Category.findOne({
      _id: categoryId,
      userId: session.user.id,
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check if another category with the same name exists
    const existingCategory = await Category.findOne({
      name,
      userId: session.user.id,
      _id: { $ne: categoryId },
    })

    if (existingCategory) {
      return NextResponse.json({ message: "Category with this name already exists" }, { status: 409 })
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { $set: { name } }, { new: true })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Category update error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const categoryId = params.id

    await connectToDatabase()

    // Find category and verify ownership
    const category = await Category.findOne({
      _id: categoryId,
      userId: session.user.id,
    })

    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check if there are tasks using this category
    const tasksWithCategory = await Task.countDocuments({
      category: categoryId,
      userId: session.user.id,
    })

    if (tasksWithCategory > 0) {
      return NextResponse.json(
        {
          message: "Cannot delete category that is being used by tasks",
          tasksCount: tasksWithCategory,
        },
        { status: 409 },
      )
    }

    // Delete category
    await Category.findByIdAndDelete(categoryId)

    return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Category deletion error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
