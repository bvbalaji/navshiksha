# Prisma with Next.js: Best Practices

This guide outlines best practices for using Prisma with Next.js, particularly focusing on avoiding common issues like the "Can't resolve '.prisma/client/index-browser'" error.

## Table of Contents

1. [Server vs. Client Components](#server-vs-client-components)
2. [Proper Prisma Client Setup](#proper-prisma-client-setup)
3. [Next.js Configuration](#nextjs-configuration)
4. [Data Access Patterns](#data-access-patterns)
5. [Troubleshooting Common Issues](#troubleshooting-common-issues)
6. [Maintenance Scripts](#maintenance-scripts)

## Server vs. Client Components

### Rule #1: Never import Prisma in client components

Prisma is a server-side library and should never be imported directly in client components. This is the most common cause of the "Can't resolve '.prisma/client/index-browser'" error.

\`\`\`tsx
// ❌ WRONG: Importing Prisma in a client component
'use client';
import { prisma } from '@/lib/prisma';

export default function UserList() {
  // This will cause errors
}
\`\`\`

### Use server components or server actions instead

\`\`\`tsx
// ✅ CORRECT: Using Prisma in a server component
import { prisma } from '@/lib/prisma';

export default async function UserList() {
  const users = await prisma.user.findMany();
  return <div>{/* Render users */}</div>;
}
\`\`\`

Or with server actions:

\`\`\`tsx
// ✅ CORRECT: Using Prisma in a server action
'use client';
import { getUsersAction } from '@/actions/user-actions';

export default function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getUsersAction().then(setUsers);
  }, []);
  
  return <div>{/* Render users */}</div>;
}
\`\`\`

## Proper Prisma Client Setup

### Use a singleton pattern with server directive

Create a `lib/server/prisma-server.ts` file:

\`\`\`ts
'use server';

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
\`\`\`

Then create a `lib/prisma.ts` file that re-exports it:

\`\`\`ts
'use server';

import prisma from './server/prisma-server';

export { prisma };
export default prisma;
\`\`\`

## Next.js Configuration

### Configure webpack to exclude Prisma from client bundles

Update your `next.config.mjs`:

\`\`\`js
export default {
  // ... other config
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add Prisma to externals
      config.externals = [...(config.externals || []), 
        '@prisma/client', 
        '.prisma/client'
      ];
    }

    // Add null loader for Prisma browser files
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.prisma\/client\/index-browser/,
      use: 'null-loader'
    });

    return config;
  },
};
\`\`\`

## Data Access Patterns

### Create dedicated data access functions

\`\`\`ts
// lib/data/users.ts
'use server';

import { prisma } from '@/lib/prisma';

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}
\`\`\`

### Use React Server Components for data fetching

\`\`\`tsx
// app/users/page.tsx
import { getUsers } from '@/lib/data/users';

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

## Troubleshooting Common Issues

### "Can't resolve '.prisma/client/index-browser'"

This error occurs when Prisma is being imported in client-side code. To fix:

1. Run `npm run fix-prisma` to automatically fix common issues
2. Run `npm run regenerate-prisma` to regenerate the Prisma client
3. Clear your Next.js cache with `rm -rf .next`
4. Ensure you're not importing Prisma in any client components

### "Module not found: Can't resolve 'fs'"

This is another sign that Prisma is being used on the client side. Follow the same steps as above.

### "Cannot find module '.prisma/client/index'"

This usually means the Prisma client hasn't been generated. Run:

\`\`\`bash
npx prisma generate
\`\`\`

## Maintenance Scripts

We've created two scripts to help maintain your Prisma setup:

### fix-prisma

This script automatically fixes common Prisma issues:

\`\`\`bash
npm run fix-prisma
\`\`\`

It will:
- Update your Next.js configuration
- Ensure server-only Prisma usage
- Check for client-side imports
- Fix Prisma schema if needed
- Add proper webpack configuration

### regenerate-prisma

This script properly regenerates the Prisma client:

\`\`\`bash
npm run regenerate-prisma
\`\`\`

It will:
- Clean up existing Prisma client
- Regenerate with proper configuration
- Verify the generated client
- Provide detailed error handling

Run these scripts whenever you encounter Prisma-related issues or after updating your Prisma schema.

## Conclusion

By following these best practices, you'll avoid the common pitfalls of using Prisma with Next.js. Remember:

1. Keep Prisma on the server
2. Use the singleton pattern
3. Configure webpack properly
4. Create dedicated data access functions
5. Use the maintenance scripts when needed

If you encounter any issues, run the `fix-prisma` and `regenerate-prisma` scripts to automatically resolve most common problems.
\`\`\`

Let's also create a server-only Prisma wrapper:
