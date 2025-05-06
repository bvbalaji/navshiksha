export function logApiError(error: any, context: string) {
    console.error(`API Error in ${context}:`, {
      message: error.message,
      cause: error.cause?.message,
      stack: error.stack,
    })
  
    // If in development, log more details
    if (process.env.NODE_ENV === "development") {
      console.error("Full error object:", error)
    }
  }
  
  export function safeStringify(obj: any): string {
    try {
      return JSON.stringify(
        obj,
        (key, value) => {
          if (value instanceof Error) {
            return {
              message: value.message,
              stack: value.stack,
              cause: value.cause,
            }
          }
          return value
        },
        2,
      )
    } catch (error) {
      return `[Error serializing object: ${error instanceof Error ? error.message : String(error)}]`
    }
  }
  