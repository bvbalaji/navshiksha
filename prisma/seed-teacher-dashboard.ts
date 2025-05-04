import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

// Main seed function for teacher dashboard
async function seedTeacherDashboard() {
  console.log("🌱 Starting teacher dashboard seeding...")

  try {
    // Get existing users
    const teacherUser = await prisma.user.findUnique({
      where: { email: "teacher@navshiksha.com" },
    })

    const studentUser = await prisma.user.findUnique({
      where: { email: "student@navshiksha.com" },
    })

    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@navshiksha.com" },
    })

    if (!teacherUser || !studentUser) {
      console.log("Required users not found. Please run the main seed script first.")
      return
    }

    // Get existing subject
    const subject = await prisma.subject.findFirst()
    if (!subject) {
      console.log("No subjects found. Please run the main seed script first.")
      return
    }

    // Get existing course
    const course = await prisma.course.findFirst()
    if (!course) {
      console.log("No courses found. Please run the main seed script first.")
      return
    }

    // Seed classes
    console.log("Seeding classes...")
    const classes = await seedClasses(teacherUser.id, subject.id)

    if (classes.length > 0) {
      // Seed class students
      console.log("Seeding class students...")
      await seedClassStudents(classes[0].id, studentUser.id)

      // Seed class courses
      console.log("Seeding class courses...")
      await seedClassCourses(classes[0].id, course.id)

      // Seed announcements
      console.log("Seeding announcements...")
      await seedAnnouncements(classes[0].id, teacherUser.id)
    }

    // Seed teacher notes
    console.log("Seeding teacher notes...")
    await seedTeacherNotes(teacherUser.id, studentUser.id)

    // Seed student feedback
    console.log("Seeding student feedback...")
    await seedStudentFeedback(studentUser.id, teacherUser.id)

    // Seed student performance
    console.log("Seeding student performance...")
    await seedStudentPerformance(studentUser.id, course.id, classes[0]?.id)

    // Seed teaching activities
    console.log("Seeding teaching activities...")
    await seedTeachingActivities(teacherUser.id)

    // Seed learning plans and objectives
    console.log("Seeding learning plans and objectives...")
    const learningPlan = await seedLearningPlan(teacherUser.id, subject.id)
    if (learningPlan) {
      await seedLearningObjectives(learningPlan.id)
      await seedPlanAssignment(learningPlan.id, studentUser.id, teacherUser.id)
    }

    console.log("✅ Teacher dashboard seeding completed successfully!")
  } catch (error) {
    console.error("❌ Teacher dashboard seeding failed:")
    console.error(error)
  }
}

// Seed classes
async function seedClasses(teacherId: string, subjectId: string) {
  const classes = [
    {
      id: randomUUID(),
      name: "Mathematics 101",
      description: "Introduction to basic mathematics concepts",
      subject_id: subjectId,
      teacher_id: teacherId,
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      name: "Advanced Mathematics",
      description: "Advanced mathematics concepts and problem solving",
      subject_id: subjectId,
      teacher_id: teacherId,
      start_date: new Date(),
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdClasses = []

  for (const classData of classes) {
    try {
      const existing = await prisma.class.findFirst({
        where: {
          name: classData.name,
          teacher_id: classData.teacher_id,
        },
      })

      if (!existing) {
        const created = await prisma.class.create({
          data: classData,
        })
        createdClasses.push(created)
        console.log(`Created class: ${created.name}`)
      } else {
        createdClasses.push(existing)
        console.log(`Class already exists: ${existing.name}`)
      }
    } catch (error) {
      console.warn(`Warning: Could not create class ${classData.name}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdClasses.length} classes`)
  return createdClasses
}

// Seed class students
async function seedClassStudents(classId: string, studentId: string) {
  try {
    const existing = await prisma.classStudent.findUnique({
      where: {
        class_id_student_id: {
          class_id: classId,
          student_id: studentId,
        },
      },
    })

    if (!existing) {
      const created = await prisma.classStudent.create({
        data: {
          class_id: classId,
          student_id: studentId,
          joined_at: new Date(),
        },
      })
      console.log(`Added student to class`)
      return created
    } else {
      console.log(`Student already in class`)
      return existing
    }
  } catch (error) {
    console.warn(`Warning: Could not add student to class`)
    console.warn(error)
    return null
  }
}

// Seed class courses
async function seedClassCourses(classId: string, courseId: string) {
  try {
    const existing = await prisma.classCourse.findUnique({
      where: {
        class_id_course_id: {
          class_id: classId,
          course_id: courseId,
        },
      },
    })

    if (!existing) {
      const created = await prisma.classCourse.create({
        data: {
          class_id: classId,
          course_id: courseId,
          assigned_at: new Date(),
        },
      })
      console.log(`Added course to class`)
      return created
    } else {
      console.log(`Course already in class`)
      return existing
    }
  } catch (error) {
    console.warn(`Warning: Could not add course to class`)
    console.warn(error)
    return null
  }
}

// Seed announcements
async function seedAnnouncements(classId: string, teacherId: string) {
  const announcements = [
    {
      id: randomUUID(),
      class_id: classId,
      teacher_id: teacherId,
      title: "Welcome to the class!",
      content: "Welcome to our class! I'm excited to start this learning journey with all of you.",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      class_id: classId,
      teacher_id: teacherId,
      title: "Upcoming Quiz",
      content: "We will have a quiz next week covering the material from chapters 1-3.",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdAnnouncements = []

  for (const announcement of announcements) {
    try {
      const existing = await prisma.announcement.findFirst({
        where: {
          title: announcement.title,
          class_id: announcement.class_id,
        },
      })

      if (!existing) {
        const created = await prisma.announcement.create({
          data: announcement,
        })
        createdAnnouncements.push(created)
        console.log(`Created announcement: ${created.title}`)
      } else {
        createdAnnouncements.push(existing)
        console.log(`Announcement already exists: ${existing.title}`)
      }
    } catch (error) {
      console.warn(`Warning: Could not create announcement ${announcement.title}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdAnnouncements.length} announcements`)
  return createdAnnouncements
}

// Seed teacher notes
async function seedTeacherNotes(teacherId: string, studentId: string) {
  const notes = [
    {
      id: randomUUID(),
      teacher_id: teacherId,
      student_id: studentId,
      content: "Student is showing great progress in algebra.",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      teacher_id: teacherId,
      student_id: studentId,
      content: "Needs additional help with geometry concepts.",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdNotes = []

  for (const note of notes) {
    try {
      const created = await prisma.teacherNote.create({
        data: note,
      })
      createdNotes.push(created)
      console.log(`Created teacher note`)
    } catch (error) {
      console.warn(`Warning: Could not create teacher note`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdNotes.length} teacher notes`)
  return createdNotes
}

// Seed student feedback
async function seedStudentFeedback(studentId: string, teacherId: string) {
  const feedbackItems = [
    {
      id: randomUUID(),
      student_id: studentId,
      teacher_id: teacherId,
      content: "I really enjoyed the interactive exercises in today's lesson.",
      feedback_type: "POSITIVE",
      created_at: new Date(),
    },
    {
      id: randomUUID(),
      student_id: studentId,
      teacher_id: teacherId,
      content: "Could we spend more time on the difficult concepts?",
      feedback_type: "SUGGESTION",
      created_at: new Date(),
    },
  ]

  const createdFeedback = []

  for (const feedback of feedbackItems) {
    try {
      const created = await prisma.studentFeedback.create({
        data: feedback,
      })
      createdFeedback.push(created)
      console.log(`Created student feedback`)
    } catch (error) {
      console.warn(`Warning: Could not create student feedback`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdFeedback.length} student feedback items`)
  return createdFeedback
}

// Seed student performance
async function seedStudentPerformance(studentId: string, courseId: string, classId?: string) {
  const performance = {
    id: randomUUID(),
    student_id: studentId,
    course_id: courseId,
    class_id: classId,
    quiz_average: 85.5,
    completion_rate: 72.0,
    engagement_score: 88.5,
    strengths: ["Algebra", "Problem Solving"],
    weaknesses: ["Geometry", "Trigonometry"],
    recorded_at: new Date(),
  }

  try {
    const created = await prisma.studentPerformance.create({
      data: performance,
    })
    console.log(`Created student performance record`)
    return created
  } catch (error) {
    console.warn(`Warning: Could not create student performance record`)
    console.warn(error)
    return null
  }
}

// Seed teaching activities
async function seedTeachingActivities(teacherId: string) {
  const activities = [
    {
      id: randomUUID(),
      teacher_id: teacherId,
      activity_type: "LESSON_CREATION",
      description: "Created a new lesson on quadratic equations",
      metadata: { duration: 45, resources_used: 3 },
      created_at: new Date(),
    },
    {
      id: randomUUID(),
      teacher_id: teacherId,
      activity_type: "FEEDBACK_PROVIDED",
      description: "Provided feedback on student assignments",
      metadata: { students_count: 15, average_score: 82 },
      created_at: new Date(),
    },
  ]

  const createdActivities = []

  for (const activity of activities) {
    try {
      const created = await prisma.teachingActivity.create({
        data: activity,
      })
      createdActivities.push(created)
      console.log(`Created teaching activity: ${created.activity_type}`)
    } catch (error) {
      console.warn(`Warning: Could not create teaching activity ${activity.activity_type}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdActivities.length} teaching activities`)
  return createdActivities
}

// Seed learning plan
async function seedLearningPlan(teacherId: string, subjectId: string) {
  const plan = {
    id: randomUUID(),
    title: "Personalized Math Learning Plan",
    description: "A customized plan to improve mathematics skills",
    subject_id: subjectId,
    level: "INTERMEDIATE",
    duration: "8 weeks",
    content: "This plan focuses on strengthening algebra and geometry skills.",
    is_template: false,
    created_by: teacherId,
    created_at: new Date(),
    updated_at: new Date(),
  }

  try {
    const existing = await prisma.learningPlan.findFirst({
      where: {
        title: plan.title,
        created_by: plan.created_by,
      },
    })

    if (!existing) {
      const created = await prisma.learningPlan.create({
        data: plan,
      })
      console.log(`Created learning plan: ${created.title}`)
      return created
    } else {
      console.log(`Learning plan already exists: ${existing.title}`)
      return existing
    }
  } catch (error) {
    console.warn(`Warning: Could not create learning plan ${plan.title}`)
    console.warn(error)
    return null
  }
}

// Seed learning objectives
async function seedLearningObjectives(planId: string) {
  const objectives = [
    {
      id: randomUUID(),
      plan_id: planId,
      description: "Master solving quadratic equations",
      success_criteria: "Able to solve any quadratic equation within 2 minutes",
      sequence_order: 1,
    },
    {
      id: randomUUID(),
      plan_id: planId,
      description: "Understand geometric principles",
      success_criteria: "Able to calculate area and volume of complex shapes",
      sequence_order: 2,
    },
    {
      id: randomUUID(),
      plan_id: planId,
      description: "Apply algebraic concepts to real-world problems",
      success_criteria: "Successfully complete 5 word problems using algebraic methods",
      sequence_order: 3,
    },
  ]

  const createdObjectives = []

  for (const objective of objectives) {
    try {
      const existing = await prisma.learningObjective.findFirst({
        where: {
          plan_id: objective.plan_id,
          sequence_order: objective.sequence_order,
        },
      })

      if (!existing) {
        const created = await prisma.learningObjective.create({
          data: objective,
        })
        createdObjectives.push(created)
        console.log(`Created learning objective: ${created.description}`)
      } else {
        createdObjectives.push(existing)
        console.log(`Learning objective already exists at sequence ${existing.sequence_order}`)
      }
    } catch (error) {
      console.warn(`Warning: Could not create learning objective ${objective.description}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdObjectives.length} learning objectives`)
  return createdObjectives
}

// Seed plan assignment
async function seedPlanAssignment(planId: string, studentId: string, teacherId: string) {
  const assignment = {
    id: randomUUID(),
    plan_id: planId,
    user_id: studentId,
    assigned_by: teacherId,
    status: "ASSIGNED",
    assigned_at: new Date(),
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    notes: "Focus on completing all objectives within the timeframe.",
  }

  try {
    const existing = await prisma.planAssignment.findFirst({
      where: {
        plan_id: assignment.plan_id,
        user_id: assignment.user_id,
      },
    })

    if (!existing) {
      const created = await prisma.planAssignment.create({
        data: assignment,
      })
      console.log(`Created plan assignment`)
      return created
    } else {
      console.log(`Plan assignment already exists`)
      return existing
    }
  } catch (error) {
    console.warn(`Warning: Could not create plan assignment`)
    console.warn(error)
    return null
  }
}

// Execute the seeding function
seedTeacherDashboard()
  .catch((e) => {
    console.error("❌ Fatal error during teacher dashboard seeding:")
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
