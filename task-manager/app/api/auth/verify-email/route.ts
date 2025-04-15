import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ message: "Verification token is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find user with the verification token
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return NextResponse.json({ message: "Invalid verification token" }, { status: 400 })
    }

    // Update user as verified
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
