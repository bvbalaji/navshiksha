import { setupApiMock, setupApiPostMock, cleanupMocks } from "../test/mock-utils"

/**
 * Setup test mocks for API endpoints
 * This should only be used in development or testing
 */
export async function setupTestMocks() {
  "use server"

  // Only run in development or test environments
  if (process.env.NODE_ENV === "production") {
    return
  }

  // Example mock for an API endpoint
  setupApiMock("https://api.example.com", "/data", { success: true, data: [{ id: 1, name: "Test" }] })

  // Example mock for a POST endpoint
  setupApiPostMock("https://api.example.com", "/submit", { name: "Test" }, { success: true, id: 123 })

  return { success: true, message: "Mocks set up successfully" }
}

/**
 * Clean up all test mocks
 * This should be called after tests are complete
 */
export async function cleanupTestMocks() {
  "use server"

  // Only run in development or test environments
  if (process.env.NODE_ENV === "production") {
    return
  }

  cleanupMocks()
  return { success: true, message: "Mocks cleaned up successfully" }
}
