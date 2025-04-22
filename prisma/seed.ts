import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"

// Initialize Prisma Client with logging to help debug
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

// Main seed function
async function main() {
  console.log("🌱 Starting database seeding...")

  try {
    // First, check the actual enum values in the database
    console.log("Checking enum values in the database...")

    // Get UserRole enum values
    const userRoleValues = await prisma.$queryRaw`
      SELECT 
        e.enumlabel AS enum_value
      FROM 
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE 
        n.nspname = 'public' AND
        t.typname = 'UserRole'
      ORDER BY 
        e.enumsortorder;
    `
    console.log("UserRole enum values:", userRoleValues)

    // Get ContentType enum values
    const contentTypeValues = await prisma.$queryRaw`
      SELECT 
        e.enumlabel AS enum_value
      FROM 
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE 
        n.nspname = 'public' AND
        t.typname = 'ContentType'
      ORDER BY 
        e.enumsortorder;
    `
    console.log("ContentType enum values:", contentTypeValues)

    // Get CourseLevel enum values
    const courseLevelValues = await prisma.$queryRaw`
      SELECT 
        e.enumlabel AS enum_value
      FROM 
        pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
      WHERE 
        n.nspname = 'public' AND
        t.typname = 'CourseLevel'
      ORDER BY 
        e.enumsortorder;
    `
    console.log("CourseLevel enum values:", courseLevelValues)

    // Seed subjects
    console.log("Seeding subjects...")
    const subjects = await seedSubjects()

    // Seed users
    console.log("Seeding users...")
    const users = await seedUsers(userRoleValues)

    if (subjects.length > 0 && users.length > 0) {
      // Seed courses
      console.log("Seeding courses...")
      const courses = await seedCourses(subjects[0].id, users[0].id, courseLevelValues)

      if (courses.length > 0) {
        // Seed modules
        console.log("Seeding modules...")
        const modules = await seedModules(courses[0].id)

        if (modules.length > 0) {
          // Seed lessons
          console.log("Seeding lessons...")
          await seedLessons(modules[0].id, contentTypeValues)
        }
      }
    }

    console.log("✅ Seeding completed successfully!")
  } catch (error) {
    console.error("❌ Seeding failed:")
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Seed subjects
async function seedSubjects() {
  const subjects = [
    {
      id: randomUUID(),
      name: "Mathematics",
      description: "Learn mathematics from basic to advanced concepts",
      icon_url: "https://example.com/icons/math.png",
    },
    {
      id: randomUUID(),
      name: "Science",
      description: "Explore the wonders of science",
      icon_url: "https://example.com/icons/science.png",
    },
    {
      id: randomUUID(),
      name: "Computer Science",
      description: "Learn programming and computer concepts",
      icon_url: "https://example.com/icons/cs.png",
    },
  ]

  const createdSubjects = []

  // Use individual creates for better error handling
  for (const subject of subjects) {
    try {
      const existing = await prisma.subject.findFirst({
        where: { name: subject.name },
      })

      if (!existing) {
        const created = await prisma.subject.create({
          data: subject,
        })
        createdSubjects.push(created)
        console.log(`Created subject: ${created.name}`)
      } else {
        createdSubjects.push(existing)
        console.log(`Subject already exists: ${existing.name}`)
      }
    } catch (createError) {
      console.warn(`Warning: Could not create subject ${subject.name}`)
      console.warn(createError)
    }
  }

  console.log(`Created ${createdSubjects.length} subjects`)
  return createdSubjects
}

// Seed users
async function seedUsers(userRoleValues) {
  // Add debug logging
  console.log("Starting seedUsers function...")
  console.log("User role values from DB:", JSON.stringify(userRoleValues, null, 2))

  // Extract the actual enum values from the database result
  // The result might be an array of objects with enum_value property
  const dbUserRoles = Array.isArray(userRoleValues) ? userRoleValues.map((v) => v.enum_value) : []

  console.log("Extracted user roles:", dbUserRoles)

  // Get the actual enum values from the database
  // Default to uppercase if we can't find the values
  const adminRole = dbUserRoles.find((v) => v === "ADMIN") || "ADMIN"
  const teacherRole = dbUserRoles.find((v) => v === "TEACHER") || "TEACHER"
  const studentRole = dbUserRoles.find((v) => v === "STUDENT") || "STUDENT"

  console.log(`Using role values: admin=${adminRole}, teacher=${teacherRole}, student=${studentRole}`)

  const users = [
    {
      id: randomUUID(),
      name: "Admin User",
      email: "admin@navshiksha.com",
      role: adminRole,
      hashed_password: "$2a$10$GmQMkLkHHP8HNBMj0pJ7AO9VFe8VGCy.nIivgZ9JXxjJFLT7.l6Ue", // 'password123'
      bio: "Administrator account",
      profile_image_url: "https://example.com/profiles/admin.png",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      name: "Teacher User",
      email: "teacher@navshiksha.com",
      role: teacherRole,
      hashed_password: "$2a$10$GmQMkLkHHP8HNBMj0pJ7AO9VFe8VGCy.nIivgZ9JXxjJFLT7.l6Ue", // 'password123'
      bio: "Experienced teacher",
      profile_image_url: "https://example.com/profiles/teacher.png",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      name: "Student User",
      email: "student@navshiksha.com",
      role: studentRole,
      hashed_password: "$2a$10$GmQMkLkHHP8HNBMj0pJ7AO9VFe8VGCy.nIivgZ9JXxjJFLT7.l6Ue", // 'password123'
      bio: "Eager student",
      profile_image_url: "https://example.com/profiles/student.png",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdUsers = []

  // Handle each user individually to better manage errors
  for (const user of users) {
    try {
      console.log(`Attempting to create/find user: ${user.email}`)

      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existing) {
        console.log(`User ${user.email} does not exist, creating...`)

        // Debug: Log the user object
        console.log("User data:", JSON.stringify(user, null, 2))

        // Use Prisma's create method instead of raw SQL for better type safety
        try {
          const created = await prisma.user.create({
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              hashed_password: user.hashed_password,
              bio: user.bio,
              profile_image_url: user.profile_image_url,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
          })

          console.log(`Created user: ${created.name}`)
          createdUsers.push(created)
        } catch (createError) {
          console.error(`Error creating user with Prisma:`, createError)

          // Fallback to raw SQL if Prisma create fails
          console.log("Falling back to raw SQL...")

          // Properly escape single quotes in SQL strings
          const escapedBio = user.bio ? user.bio.replace(/'/g, "''") : null
          const escapedName = user.name ? user.name.replace(/'/g, "''") : null

          const sql = `
            INSERT INTO users (
              id, name, email, role, hashed_password, bio, profile_image_url, created_at, updated_at
            ) VALUES (
              '${user.id}', 
              '${escapedName}', 
              '${user.email}', 
              '${user.role}', 
              '${user.hashed_password}', 
              ${escapedBio ? `'${escapedBio}'` : "NULL"}, 
              ${user.profile_image_url ? `'${user.profile_image_url}'` : "NULL"}, 
              '${user.created_at.toISOString()}', 
              '${user.updated_at.toISOString()}'
            )
            ON CONFLICT (email) DO NOTHING
            RETURNING id;
          `

          // Log the SQL we're about to execute
          console.log("Executing SQL:", sql)

          // Execute the SQL
          const result = await prisma.$executeRawUnsafe(sql)

          if (result) {
            console.log(`Created user via SQL: ${user.name}`)

            // Fetch the created user to add to our array
            const created = await prisma.user.findUnique({
              where: { email: user.email },
            })

            if (created) {
              createdUsers.push(created)
            }
          }
        }
      } else {
        console.log(`User ${existing.email} already exists, skipping creation`)
        createdUsers.push(existing)
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error)
    }
  }

  console.log(`Created/found ${createdUsers.length} users`)
  return createdUsers
}

// Seed courses
async function seedCourses(subjectId, creatorId, courseLevelValues) {
  // Extract the actual enum values from the database result
  const dbCourseLevels = Array.isArray(courseLevelValues) ? courseLevelValues.map((v) => v.enum_value) : []

  console.log("Extracted course levels:", dbCourseLevels)

  // Get the actual enum values from the database
  const beginnerLevel = dbCourseLevels.find((v) => v === "BEGINNER") || "BEGINNER"
  const advancedLevel = dbCourseLevels.find((v) => v === "ADVANCED") || "ADVANCED"

  console.log(`Using course level values: beginner=${beginnerLevel}, advanced=${advancedLevel}`)

  const courses = [
    {
      id: randomUUID(),
      title: "Introduction to Algebra",
      description: "Learn the basics of algebra",
      subject_id: subjectId,
      creator_id: creatorId,
      level: beginnerLevel,
      is_published: true,
      estimated_duration: 600, // 10 hours in minutes
      thumbnail_url: "https://example.com/thumbnails/algebra.png",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: "Advanced Calculus",
      description: "Dive deep into calculus concepts",
      subject_id: subjectId,
      creator_id: creatorId,
      level: advancedLevel,
      is_published: true,
      estimated_duration: 1200, // 20 hours in minutes
      thumbnail_url: "https://example.com/thumbnails/calculus.png",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdCourses = []

  for (const course of courses) {
    try {
      const existing = await prisma.course.findFirst({
        where: {
          title: course.title,
          subject_id: course.subject_id,
        },
      })

      if (!existing) {
        // Try using Prisma's create method first
        try {
          const created = await prisma.course.create({
            data: course,
          })
          createdCourses.push(created)
          console.log(`Created course: ${created.title}`)
        } catch (createError) {
          console.error(`Error creating course with Prisma:`, createError)

          // Fallback to raw SQL if Prisma create fails
          console.log("Falling back to raw SQL...")

          // Properly escape single quotes in SQL strings
          const escapedTitle = course.title.replace(/'/g, "''")
          const escapedDescription = course.description ? course.description.replace(/'/g, "''") : null

          const sql = `
            INSERT INTO courses (
              id, title, description, subject_id, creator_id, level, is_published, 
              estimated_duration, thumbnail_url, created_at, updated_at
            ) VALUES (
              '${course.id}', 
              '${escapedTitle}', 
              ${escapedDescription ? `'${escapedDescription}'` : "NULL"}, 
              '${course.subject_id}', 
              '${course.creator_id}', 
              '${course.level}', 
              ${course.is_published}, 
              ${course.estimated_duration}, 
              ${course.thumbnail_url ? `'${course.thumbnail_url}'` : "NULL"}, 
              '${course.created_at.toISOString()}', 
              '${course.updated_at.toISOString()}'
            )
            ON CONFLICT DO NOTHING
            RETURNING id;
          `

          // Log the SQL we're about to execute
          console.log("Executing SQL:", sql)

          // Execute the SQL
          const result = await prisma.$executeRawUnsafe(sql)

          if (result) {
            console.log(`Created course via SQL: ${course.title}`)

            // Fetch the created course to add to our array
            const created = await prisma.course.findFirst({
              where: {
                title: course.title,
                subject_id: course.subject_id,
              },
            })

            if (created) {
              createdCourses.push(created)
            }
          }
        }
      } else {
        createdCourses.push(existing)
        console.log(`Course already exists: ${existing.title}`)
      }
    } catch (error) {
      console.warn(`Warning: Could not create course ${course.title}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdCourses.length} courses`)
  return createdCourses
}

// Seed modules
async function seedModules(courseId) {
  const modules = [
    {
      id: randomUUID(),
      title: "Getting Started",
      description: "Introduction to the course",
      course_id: courseId,
      sequence_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: "Core Concepts",
      description: "Fundamental principles and ideas",
      course_id: courseId,
      sequence_order: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: "Advanced Topics",
      description: "More complex and specialized material",
      course_id: courseId,
      sequence_order: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdModules = []

  for (const module of modules) {
    try {
      const existing = await prisma.module.findFirst({
        where: {
          title: module.title,
          course_id: module.course_id,
        },
      })

      if (!existing) {
        const created = await prisma.module.create({
          data: module,
        })
        createdModules.push(created)
        console.log(`Created module: ${created.title}`)
      } else {
        createdModules.push(existing)
        console.log(`Module already exists: ${existing.title}`)
      }
    } catch (error) {
      console.warn(`Warning: Could not create module ${module.title}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdModules.length} modules`)
  return createdModules
}

// Seed lessons
async function seedLessons(moduleId, contentTypeValues) {
  // Extract the actual enum values from the database result
  const dbContentTypes = Array.isArray(contentTypeValues) ? contentTypeValues.map((v) => v.enum_value) : []

  console.log("Extracted content types:", dbContentTypes)

  // Get the actual enum values from the database
  const textType = dbContentTypes.find((v) => v === "TEXT") || "TEXT"
  const videoType = dbContentTypes.find((v) => v === "VIDEO") || "VIDEO"

  console.log(`Using content type values: text=${textType}, video=${videoType}`)

  const lessons = [
    {
      id: randomUUID(),
      title: "Introduction",
      content: "Welcome to the course! In this lesson, we will...",
      module_id: moduleId,
      content_type: textType,
      sequence_order: 1,
      estimated_duration: 15, // 15 minutes
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: "Basic Concepts",
      content: "Let's explore the fundamental concepts...",
      module_id: moduleId,
      content_type: textType,
      sequence_order: 2,
      estimated_duration: 30, // 30 minutes
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: "Practical Examples",
      content: "Now let's look at some practical examples...",
      module_id: moduleId,
      content_type: videoType,
      sequence_order: 3,
      estimated_duration: 45, // 45 minutes
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]

  const createdLessons = []

  for (const lesson of lessons) {
    try {
      const existing = await prisma.lesson.findFirst({
        where: {
          title: lesson.title,
          module_id: lesson.module_id,
        },
      })

      if (!existing) {
        // Try using Prisma's create method first
        try {
          const created = await prisma.lesson.create({
            data: lesson,
          })
          createdLessons.push(created)
          console.log(`Created lesson: ${created.title}`)
        } catch (createError) {
          console.error(`Error creating lesson with Prisma:`, createError)

          // Fallback to raw SQL if Prisma create fails
          console.log("Falling back to raw SQL...")

          // Properly escape single quotes in SQL strings
          const escapedTitle = lesson.title.replace(/'/g, "''")
          const escapedContent = lesson.content.replace(/'/g, "''")

          const sql = `
            INSERT INTO lessons (
              id, title, content, module_id, content_type, sequence_order, 
              estimated_duration, created_at, updated_at
            ) VALUES (
              '${lesson.id}', 
              '${escapedTitle}', 
              '${escapedContent}', 
              '${lesson.module_id}', 
              '${lesson.content_type}', 
              ${lesson.sequence_order}, 
              ${lesson.estimated_duration}, 
              '${lesson.created_at.toISOString()}', 
              '${lesson.updated_at.toISOString()}'
            )
            ON CONFLICT DO NOTHING
            RETURNING id;
          `

          // Log the SQL we're about to execute
          console.log("Executing SQL:", sql)

          // Execute the SQL
          const result = await prisma.$executeRawUnsafe(sql)

          if (result) {
            console.log(`Created lesson via SQL: ${lesson.title}`)

            // Fetch the created lesson to add to our array
            const created = await prisma.lesson.findFirst({
              where: {
                title: lesson.title,
                module_id: lesson.module_id,
              },
            })

            if (created) {
              createdLessons.push(created)
            }
          }
        }
      } else {
        createdLessons.push(existing)
        console.log(`Lesson already exists: ${existing.title}`)
      }
    } catch (error) {
      console.warn(`Warning: Could not create lesson ${lesson.title}`)
      console.warn(error)
    }
  }

  console.log(`Created ${createdLessons.length} lessons`)
  return createdLessons
}

// Execute the main function
main().catch((e) => {
  console.error("❌ Fatal error during seeding:")
  console.error(e)
  process.exit(1)
})
