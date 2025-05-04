# Simplified Authentication System

This document describes the simplified authentication system implemented in the Navshiksha project.

## Overview

The authentication system uses the built-in Node.js crypto module for password hashing and verification, eliminating the need for external libraries. This approach is simpler and has fewer dependencies.

## Components

### 1. Simple Crypto Utilities (`lib/crypto/simple-crypto.ts`)

- Password hashing and verification using scrypt
- Token generation and verification
- Data hashing using SHA-256

### 2. Server-Side Authentication (`lib/server/auth-service.ts`)

- User credential verification
- User creation with password hashing
- Authentication token generation and verification
- Password updating

### 3. Client-Side Authentication (`lib/client/auth-client.ts`)

- Sign in and sign out functionality
- Password reset requests
- Integration with NextAuth.js

## Security Considerations

While this simplified system is adequate for many applications, it has some limitations:

1. **Scrypt Implementation**: The implementation uses Node.js's built-in scrypt, which is strong but may not have all the protections of specialized password hashing libraries.

2. **Simple Token Implementation**: The token implementation is simpler than a full JWT library and may not handle all edge cases.

## Usage Examples

### Hashing a Password

\`\`\`typescript
import { hashPassword } from '@/lib/crypto/simple-crypto';

const hashedPassword = hashPassword('user-password');
\`\`\`

### Verifying a Password

\`\`\`typescript
import { verifyPassword } from '@/lib/crypto/simple-crypto';

const isValid = verifyPassword('user-password', hashedPassword);
\`\`\`

### Creating a User

\`\`\`typescript
import { createUser } from '@/lib/server/auth-service';

const user = await createUser('John Doe', 'john@example.com', 'password123');
\`\`\`

### Verifying Credentials

\`\`\`typescript
import { verifyUserCredentials } from '@/lib/server/auth-service';

const user = await verifyUserCredentials('john@example.com', 'password123');
\`\`\`

## Environment Variables

The system uses the following environment variables:

- `JWT_SECRET`: Secret key for token signing
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js

## Maintenance

This simplified system should be periodically reviewed for security updates and best practices.
\`\`\`

Let's update the package.json to add the setup-simple-auth script:
