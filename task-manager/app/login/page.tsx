import { LoginForm } from "@/components/login-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login to Your Account</h1>
          <p className="mt-2 text-sm text-slate-600">Enter your credentials to access your tasks</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
