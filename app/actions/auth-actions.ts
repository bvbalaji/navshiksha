"use server"
import { redirect } from "next/navigation"
import { LoginSchema, verifyCredentials, createSessionToken, setSessionCookie, logout as logoutUser } from "@/lib/auth"

export async function login(prevState: any, formData: FormData) {
  // Validate form data
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to log in.",
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Verify credentials
    const user = await verifyCredentials(email, password)

    if (!user) {
      return {
        errors: {
          email: ["Invalid email or password"],
          password: ["Invalid email or password"],
        },
        message: "Invalid credentials",
      }
    }

    // Create session token
    const token = await createSessionToken(user)

    // Set session cookie
    await setSessionCookie(token)

    // Redirect based on user role
    if (user.role === "teacher") {
      redirect("/dashboard/teacher")
    } else {
      redirect("/dashboard")
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      message: "An error occurred during login.",
    }
  }
}

export async function logout() {
  await logoutUser()
  redirect("/login")
}

