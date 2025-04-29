import { PrismaClient } from "@prisma/client"
import { ResourceForm } from "@/components/teacher/content/resource-form"
import { requireRole } from "@/lib/auth-utils"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

async function getResource(id: string, userId: string) {
  const resource = await prisma.resource.findUnique({
    where: { id, created_by: userId },
  })

  if (!resource) {
    notFound()
  }

  return resource
}

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const resource = await getResource(params.id, session.user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Resource</h1>
      <ResourceForm resource={resource} userId={session.user.id} />
    </div>
  )
}
