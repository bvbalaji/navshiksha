import { ResourceForm } from "@/components/teacher/content/resource-form"
import { requireRole } from "@/lib/auth/auth"

export default async function CreateResourcePage() {
  const session = await requireRole(["TEACHER", "ADMIN"])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Resource</h1>
      <ResourceForm userId={session.user.id} />
    </div>
  )
}
