import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config" 

export async function getCourses({
  query,
  subjectId,
  level,
}: {
  query?: string
  subjectId?: string
  level?: string
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return []
  }

  return prisma.course.findMany({
    where: {
      creator_id: session.user.id,
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(subjectId && { subjectId }),
      ...(level && { level: level as any }),
    },
    include: {
      subject: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          modules: true,
          enrollments: true,
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
  })
}

export async function getCourseById(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  return prisma.course.findFirst({
    where: {
      id,
      creator_id: session.user.id,
    },
    include: {
      subject: true,
    },
  })
}

export async function getCourseWithModules(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  return prisma.course.findFirst({
    where: {
      id,
      creator_id: session.user.id,
    },
    include: {
      subject: true,
      modules: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              content_type: true,
              sequence_order: true,
              estimated_duration: true,
            },
            orderBy: {
              sequence_order: "asc",
            },
          },
        },
        orderBy: {
          sequence_order: "asc",
        },
      },
    },
  })
}
