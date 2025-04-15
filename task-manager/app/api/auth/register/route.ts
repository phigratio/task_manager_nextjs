import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { hash } from "bcryptjs"
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex")

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      verificationToken,
    })

    await newUser.save()

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
