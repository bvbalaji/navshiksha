"use client"

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

/**
 * Client-side function to sign in a user
 */
export async function signIn(email: string, password: string, callbackUrl?: string) {
  try {
    const result = await nextAuthSignIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return {
        success: false,
        error: result.error,
      }
    }

    if (callbackUrl) {
      window.location.href = callbackUrl
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

/**
 * Client-side function to sign out a user
 */
export async function signOut(callbackUrl?: string) {
  try {
    await nextAuthSignOut({
      redirect: Boolean(callbackUrl),
      callbackUrl,
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Sign out error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

/**
 * Client-side function to request password reset
 */
export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    return {
      success: response.ok,
      message: data.message,
      error: !response.ok ? data.error : undefined,
    }
  } catch (error) {
    console.error("Password reset request error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

/**
 * Store a token in localStorage
 */
export function storeToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

/**
 * Retrieve a token from localStorage
 */
export function getStoredToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

/**
 * Remove a token from localStorage
 */
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}
