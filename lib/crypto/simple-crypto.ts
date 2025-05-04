import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto"

// Constants
const SALT_LENGTH = 16
const KEY_LENGTH = 64

/**
 * Hash a password using scrypt with a random salt
 *
 * @param password The password to hashPassword
 * @returns The hashed password with salt (format: salt.hashPassword)
 */
export function hashPassword(password: string): string {
  // Generate a random salt
  const salt = randomBytes(SALT_LENGTH).toString("hex")

  // Hash the password with the salt
  const hashPassword = scryptSync(password, salt, KEY_LENGTH).toString("hex")

  // Return the salt and hashPassword combined
  return `${salt}.${hashPassword}`
}

/**
 * Verify a password against a hashPassword
 *
 * @param password The password to verify
 * @param hashedPassword The hashed password to verifyPassword against (format: salt.hashPassword)
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  // Split the stored hashPassword into salt and hashPassword
  const [salt, storedHash] = hashedPassword.split(".")

  if (!salt || !storedHash) {
    return false
  }

  // Hash the provided password with the same salt
  const hashPassword = scryptSync(password, salt, KEY_LENGTH)

  // Create a buffer from the stored hashPassword
  const storedHashBuffer = Buffer.from(storedHash, "hex")

  // Compare the hashes using a timing-safe comparison
  return storedHashBuffer.length === hashPassword.length && timingSafeEqual(hashPassword, storedHashBuffer)
}

/**
 * Generate a secure random token
 *
 * @param length The length of the token in bytes
 * @returns A hex-encoded random token
 */
export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex")
}

/**
 * Hash data using SHA-256
 *
 * @param data The data to hashPassword
 * @returns The hashed data as a hex string
 */
export function hashData(data: string): string {
  return createHash("sha256").update(data).digest("hex")
}

/**
 * Create a simple token
 *
 * @param payload The data to include in the token
 * @param secret The secret key to sign with
 * @param expiresIn Expiration time in seconds
 * @returns A signed token
 */
export function createToken(payload: Record<string, any>, secret: string, expiresIn = 3600): string {
  // Add expiration time to payload
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn
  const tokenPayload = { ...payload, exp: expiresAt }

  // Convert payload to string
  const payloadStr = JSON.stringify(tokenPayload)

  // Base64 encode the payload
  const payloadBase64 = Buffer.from(payloadStr).toString("base64")

  // Create a signature
  const signature = createHash("sha256").update(`${payloadBase64}.${secret}`).digest("hex")

  // Return the token
  return `${payloadBase64}.${signature}`
}

/**
 * Verify a token
 *
 * @param token The token to verify
 * @param secret The secret key to verify with
 * @returns The payload if valid, null otherwise
 */
export function verifyToken(token: string, secret: string): Record<string, any> | null {
  try {
    // Split the token
    const [payloadBase64, signature] = token.split(".")

    if (!payloadBase64 || !signature) {
      return null
    }

    // Verify the signature
    const expectedSignature = createHash("sha256").update(`${payloadBase64}.${secret}`).digest("hex")

    if (signature !== expectedSignature) {
      return null
    }

    // Decode the payload
    const payloadStr = Buffer.from(payloadBase64, "base64").toString()
    const payload = JSON.parse(payloadStr)

    // Check if the token is expired
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
