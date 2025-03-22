import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

// Mock user database - in a real app, this would be a database
const users = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "student",
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah@example.com",
    password: "password123",
    role: "teacher",
  },
]

// Login schema for validation
const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

// Find user by email (mock implementation)
async function findUserByEmail(email: string) {
  return users.find((user) => user.email === email) || null
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // Validate credentials
          const validatedFields = LoginSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          })

          if (!validatedFields.success) {
            console.log("Validation failed", validatedFields.error.flatten())
            return null
          }

          const { email, password } = validatedFields.data

          // Find user by email
          const user = await findUserByEmail(email)

          if (!user) {
            console.log("User not found")
            return null
          }

          // For demo purposes with our mock data:
          const passwordMatch = user.password === password

          if (!passwordMatch) {
            console.log("Password doesn't match")
            return null
          }

          console.log("Auth successful for", user.email, "with role", user.role)

          // Return user without password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token when user signs in
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Add role to session from token
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
}

