import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"
import { requireRole } from "@/lib/auth-utils"
import Link from "next/link"
import { FileText, Plus, Users, Edit } from "lucide-react"

const prisma = new PrismaClient()

async function getLearningPlans(teacherId: string) {
  return prisma.learningPlan.findMany({
    where: { created_by: teacherId },
    include: {
      subject: true,
      _count: {
        select: { assignments: true, objectives: true },
      },
    },
    orderBy: { updated_at: "desc" },
  })
}

async function getAssignedPlans(teacherId: string) {
  return prisma.planAssignment.findMany({
    where: { assigned_by: teacherId },
    include: {
      plan: {
        include: {
          subject: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile_image_url: true,
        },
      },
    },
    orderBy: { assigned_at: "desc" },
  })
}

export default async function LearningPlansPage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const plans = await getLearningPlans(teacherId)
  const assignments = await getAssignedPlans(teacherId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Learning Plans</h1>
        <Button asChild>
          <Link href="/teacher/plans/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Plan Templates</h2>
          {plans.length > 0 ? (
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{plan.title}</CardTitle>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${plan.is_template ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                      >
                        {plan.is_template ? "Template" : "Custom Plan"}
                      </span>
                    </div>
                    <CardDescription>
                      {plan.subject.name} • {plan.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {plan.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{plan._count.objectives} objectives</span>
                      </div>
                      <div>{plan._count.assignments} assignments</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/plans/edit/${plan.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/teacher/plans/assign/${plan.id}`}>
                        <Users className="mr-2 h-4 w-4" />
                        Assign
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No learning plans yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">Create your first learning plan template</p>
                <Button asChild>
                  <Link href="/teacher/plans/create">Create Plan</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Assigned Plans</h2>
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1">{assignment.plan.title}</CardTitle>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          assignment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : assignment.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    <CardDescription>Assigned to: {assignment.user.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                        {assignment.user.profile_image_url ? (
                          <img
                            src={assignment.user.profile_image_url || "/placeholder.svg"}
                            alt={assignment.user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                            {assignment.user.name?.charAt(0) || "S"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{assignment.user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/plans/assignment/${assignment.id}`}>View Progress</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/teacher/students/${assignment.user.id}`}>
                        <Users className="mr-2 h-4 w-4" />
                        Student Profile
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">No assigned plans</h3>
                <p className="mb-4 text-sm text-muted-foreground">Assign learning plans to your students</p>
                <Button asChild disabled={plans.length === 0}>
                  <Link href={plans.length > 0 ? `/teacher/plans/assign/${plans[0].id}` : "#"}>Assign Plan</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
