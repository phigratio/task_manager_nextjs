import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/lib/models"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      name,
      userId: session.user.id,
    })

    if (existingCategory) {
      return NextResponse.json({ message: "Category already exists" }, { status: 409 })
    }

    // Create new category
    const newCategory = new Category({
      name,
      userId: session.user.id,
    })

    await newCategory.save()

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Category creation error:", error)
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

    // Get categories for the current user
    const categories = await Category.find({ userId: session.user.id }).sort({ name: 1 })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Category fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
