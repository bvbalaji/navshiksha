import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email: string
    role: UserRole
    image?: string | null
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email: string
      role: UserRole
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}
