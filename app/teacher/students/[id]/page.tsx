import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth/auth"
import { StudentProfile } from "@/components/teacher/student-profile"
import { StudentPerformanceOverview } from "@/components/teacher/analytics/student-performance-overview"
import { StudentFeedbackForm } from "@/components/teacher/student-feedback-form"

const prisma = new PrismaClient()

async function getStudentDetails(studentId: string) {
  const student = await prisma.user.findUnique({
    where: { id: studentId, role: "STUDENT" },
    include: {
      user_profile: true,
    },
  })

  if (!student) return null

  return {
    id: student.id,
    name: student.name || "Unknown",
    email: student.email,
    profileImageUrl: student.profile_image_url,
    role: student.role,
    createdAt: student.created_at.toISOString(),
    profile: student.user_profile
      ? {
          dateOfBirth: student.user_profile.date_of_birth?.toISOString() || undefined,
          educationLevel: student.user_profile.education_level,
          preferredLanguage: student.user_profile.preferred_language,
          timezone: student.user_profile.timezone,
          learningStyle: student.user_profile.learning_style,
          preferredSubjects: student.user_profile.preferred_subjects,
        }
      : undefined,
  }
}

async function getStudentEnrollments(studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { user_id: studentId },
    include: {
      course: true,
    },
    orderBy: { enrolled_at: "desc" },
  })

  return enrollments.map((enrollment) => ({
    id: enrollment.id,
    courseId: enrollment.course_id,
    courseTitle: enrollment.course.title,
    lastAccessedAt: enrollment.last_accessed_at?.toISOString(),
    completedAt: enrollment.completed_at?.toISOString(),
  }))
}

async function getStudentCourseProgress(studentId: string, courseId: string) {
  // Calculate the average progress percentage across all lessons in the course
  const courseModules = await prisma.module.findMany({
    where: { course_id: courseId },
    include: {
      lessons: {
        include: {
          progress: {
            where: { user_id: studentId },
          },
        },
      },
    },
  })

  let totalLessons = 0
  let completedLessons = 0
  let progressSum = 0

  courseModules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      totalLessons++
      if (lesson.progress.length > 0) {
        progressSum += lesson.progress[0].progress_percentage
        if (lesson.progress[0].status === "COMPLETED") {
          completedLessons++
        }
      }
    })
  })

  if (totalLessons === 0) return 0
  return Math.round(progressSum / totalLessons)
}

async function getStudentLearningPlans(studentId: string) {
  const planAssignments = await prisma.planAssignment.findMany({
    where: { user_id: studentId },
    include: {
      plan: true,
    },
    orderBy: { assigned_at: "desc" },
  })

  return planAssignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.plan.title,
    status: assignment.status,
    assignedAt: assignment.assigned_at.toISOString(),
    startDate: assignment.start_date?.toISOString(),
    endDate: assignment.end_date?.toISOString(),
  }))
}

async function getTeacherNotes(teacherId: string, studentId: string) {
  return prisma.teacherNote.findMany({
    where: {
      teacher_id: teacherId,
      student_id: studentId,
    },
    orderBy: {
      created_at: "desc",
    },
  })
}

export default async function StudentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const studentId = params.id
  const student = await getStudentDetails(studentId)

  if (!student) {
    notFound()
  }

  // Check if this teacher has access to this student
  const hasAccess = await prisma.classStudent.findFirst({
    where: {
      student_id: studentId,
      class: {
        teacher_id: teacherId,
      },
    },
  })

  if (!hasAccess && session.user.role !== "ADMIN") {
    notFound()
  }

  const enrollments = await getStudentEnrollments(studentId)
  const learningPlans = await getStudentLearningPlans(studentId)
  const teacherNotes = await getTeacherNotes(teacherId, studentId)

  return (
    <div className="space-y-6">
      <StudentProfile
        student={student}
        enrollments={enrollments}
        learningPlans={learningPlans}
        teacherNotes={teacherNotes}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <StudentPerformanceOverview studentId={studentId} />
        <StudentFeedbackForm teacherId={teacherId} studentId={studentId} />
      </div>
    </div>
  )
}
