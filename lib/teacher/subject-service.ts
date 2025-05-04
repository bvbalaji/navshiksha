import { prisma } from "@/lib/prisma"

export async function getSubjects() {
  return prisma.subject.findMany({
    orderBy: {
      name: "asc",
    },
  })
}
