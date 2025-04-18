import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create subjects
  const subjects = [
    { name: "Mathematics", description: "Numbers, algebra, geometry, and more", iconUrl: "/icons/math.svg" },
    { name: "Science", description: "Physics, chemistry, biology, and more", iconUrl: "/icons/science.svg" },
    {
      name: "History",
      description: "World history, civilizations, and historical events",
      iconUrl: "/icons/history.svg",
    },
    { name: "Language Arts", description: "Reading, writing, grammar, and literature", iconUrl: "/icons/language.svg" },
    {
      name: "Computer Science",
      description: "Programming, algorithms, and computer systems",
      iconUrl: "/icons/cs.svg",
    },
  ]

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    })
  }

  // Create admin user
  const adminPassword = await hash("Admin123!", 12)
  await prisma.user.upsert({
    where: { email: "admin@naviksha.edu" },
    update: {},
    create: {
      email: "admin@naviksha.edu",
      name: "Admin User",
      hashedPassword: adminPassword,
      role: "admin",
    },
  })

  // Create teacher user
  const teacherPassword = await hash("Teacher123!", 12)
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@naviksha.edu" },
    update: {},
    create: {
      email: "teacher@naviksha.edu",
      name: "Demo Teacher",
      hashedPassword: teacherPassword,
      role: "teacher",
      bio: "Experienced educator with 10+ years teaching mathematics and science.",
    },
  })

  // Create student user
  const studentPassword = await hash("Student123!", 12)
  const student = await prisma.user.upsert({
    where: { email: "student@naviksha.edu" },
    update: {},
    create: {
      email: "student@naviksha.edu",
      name: "Demo Student",
      hashedPassword: studentPassword,
      role: "learner",
    },
  })

  // Create student profile
  await prisma.userProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      preferredSubjects: ["Mathematics", "Science"],
      learningStyle: "Visual",
      preferredLanguage: "English",
    },
  })

  // Create achievements
  const achievements = [
    {
      title: "First Login",
      description: "Logged into the platform for the first time",
      iconUrl: "/icons/achievements/first-login.svg",
    },
    {
      title: "Course Completer",
      description: "Completed your first course",
      iconUrl: "/icons/achievements/course-complete.svg",
    },
    {
      title: "Perfect Score",
      description: "Achieved 100% on a quiz",
      iconUrl: "/icons/achievements/perfect-score.svg",
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { title: achievement.title },
      update: {},
      create: achievement,
    })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
