# Authentication System Documentation

This document provides an overview of the authentication system used in the Navshiksha project.

## Architecture

The authentication system is built using Next-Auth v4 with a Prisma adapter. It follows a clear separation between client and server code to ensure security and prevent issues with Node.js modules in the browser.

### Key Components

1. **Server Authentication Utilities** (`lib/server/auth-utils.ts`)
   - Core authentication functions that run only on the server
   - Password hashing and verification using bcrypt
   - User creation, retrieval, and password management

2. **Client Authentication Utilities** (`lib/client/auth-client.ts`)
   - Browser-safe authentication functions
   - Sign in, sign out, and password reset request handling
   - No Node.js dependencies

3. **Server Authentication Service** (`lib/server/auth-service.ts`)
   - Higher-level authentication services
   - Session management
   - Role-based access control
   - User registration and password reset

4. **Next-Auth Configuration** (`app/api/auth/[...nextauth]/route.ts`)
   - Configures Next-Auth with the Prisma adapter
   - Sets up the credentials provider
   - Defines JWT and session callbacks
   - Configures custom pages and error handling

## Authentication Flow

1. **User Login**
   - User submits credentials via the login form
   - Credentials are sent to the Next-Auth API route
   - Server verifies credentials using bcrypt
   - JWT token is generated and stored in cookies
   - User is redirected based on their role

2. **Session Management**
   - JWT token is used to maintain the user's session
   - Session information is available on both client and server
   - Role information is included in the session for access control

3. **Access Control**
   - Middleware checks the user's role for protected routes
   - Server components can use `hasRole` to verify permissions
   - Client components can use session data to show/hide UI elements

## Security Considerations

- Passwords are hashed using bcrypt with a cost factor of 10
- Authentication logic runs exclusively on the server
- JWT tokens are signed with a secret key
- Session cookies use HTTP-only flag for XSS protection
- CSRF protection is enabled by default

## Usage Examples

### Server-Side Authentication Check

\`\`\`typescript
import { getCurrentUser } from "@/lib/server/auth-service"

export default async function ProtectedPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }
  
  return <div>Welcome, {user.name}!</div>
}
\`\`\`

### Client-Side Login

\`\`\`typescript
"use client"
import { useState } from "react"
import { signIn } from "@/lib/client/auth-client"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn(email, password, "/dashboard")
    
    if (!result.success) {
      // Handle error
    }
  }
  
  // Form JSX
}
\`\`\`

### Role-Based Access Control

\`\`\`typescript
import { hasRole } from "@/lib/server/auth-service"
import { UserRole } from "@prisma/client"

export default async function AdminPage() {
  const isAdmin = await hasRole(UserRole.ADMIN)
  
  if (!isAdmin) {
    redirect("/unauthorized")
  }
  
  return <div>Admin Dashboard</div>
}
\`\`\`

## Troubleshooting

If you encounter authentication issues, check the following:

1. Ensure environment variables are properly set:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `DATABASE_URL`

2. Check that the Prisma schema matches the expected structure for the adapter

3. Verify that bcrypt is only being used in server components or API routes

4. Clear browser cookies and try logging in again if sessions seem stuck

5. Check server logs for detailed error messages
