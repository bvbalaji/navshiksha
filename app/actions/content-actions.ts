"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const prisma = new PrismaClient()

// Course validation schema
const CourseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  subjectId: z.string().uuid({ message: "Valid subject ID is required" }),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  estimatedDuration: z.coerce.number().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
})

// Module validation schema
const ModuleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  courseId: z.string().uuid({ message: "Valid course ID is required" }),
})

// Lesson validation schema
const LessonSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  moduleId: z.string().uuid({ message: "Valid module ID is required" }),
  contentType: z.enum(["TEXT", "VIDEO", "INTERACTIVE", "QUIZ"]),
  estimatedDuration: z.coerce.number().optional(),
})

// Resource validation schema
const ResourceSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  resourceType: z.enum(["PDF", "VIDEO", "LINK", "IMAGE", "DOCUMENT", "OTHER"]),
  url: z.string().url().optional(),
  content: z.string().optional(),
})

// Create course action
export async function createCourse(formData: FormData) {
  const validatedFields = CourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    subjectId: formData.get("subjectId"),
    level: formData.get("level"),
    estimatedDuration: formData.get("estimatedDuration"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    isPublished: formData.get("isPublished") === "true",
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, subjectId, level, estimatedDuration, thumbnailUrl, isPublished } = validatedFields.data
  const creatorId = formData.get("creatorId") as string

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        subject_id: subjectId,
        creator_id: creatorId,
        level,
        estimated_duration: estimatedDuration,
        thumbnail_url: thumbnailUrl || null,
        is_published: isPublished,
      },
    })

    revalidatePath("/teacher/content")
    return { success: true, courseId: course.id }
  } catch (error) {
    console.error("Failed to create course:", error)
    return { error: { server: "Failed to create course. Please try again." } }
  }
}

// Update course action
export async function updateCourse(courseId: string, formData: FormData) {
  const validatedFields = CourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    subjectId: formData.get("subjectId"),
    level: formData.get("level"),
    estimatedDuration: formData.get("estimatedDuration"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    isPublished: formData.get("isPublished") === "true",
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, subjectId, level, estimatedDuration, thumbnailUrl, isPublished } = validatedFields.data

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        subject_id: subjectId,
        level,
        estimated_duration: estimatedDuration,
        thumbnail_url: thumbnailUrl || null,
        is_published: isPublished,
      },
    })

    revalidatePath("/teacher/content")
    revalidatePath(`/teacher/content/edit-course/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update course:", error)
    return { error: { server: "Failed to update course. Please try again." } }
  }
}

// Delete course action
export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({
      where: { id: courseId },
    })

    revalidatePath("/teacher/content")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete course:", error)
    return { error: "Failed to delete course. Please try again." }
  }
}

// Create module action
export async function createModule(formData: FormData) {
  const validatedFields = ModuleSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    courseId: formData.get("courseId"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, courseId } = validatedFields.data

  try {
    // Get the current highest sequence order
    const highestModule = await prisma.module.findFirst({
      where: { course_id: courseId },
      orderBy: { sequence_order: "desc" },
    })

    const sequenceOrder = highestModule ? highestModule.sequence_order + 1 : 1

    const module = await prisma.module.create({
      data: {
        title,
        description,
        course_id: courseId,
        sequence_order: sequenceOrder,
      },
    })

    revalidatePath(`/teacher/content/edit-course/${courseId}`)
    return { success: true, moduleId: module.id }
  } catch (error) {
    console.error("Failed to create module:", error)
    return { error: { server: "Failed to create module. Please try again." } }
  }
}

// Update module action
export async function updateModule(moduleId: string, formData: FormData) {
  const validatedFields = ModuleSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    courseId: formData.get("courseId"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description } = validatedFields.data

  try {
    await prisma.module.update({
      where: { id: moduleId },
      data: {
        title,
        description,
      },
    })

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { course_id: true },
    })

    if (module) {
      revalidatePath(`/teacher/content/edit-course/${module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update module:", error)
    return { error: { server: "Failed to update module. Please try again." } }
  }
}

// Delete module action
export async function deleteModule(moduleId: string) {
  try {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { course_id: true },
    })

    await prisma.module.delete({
      where: { id: moduleId },
    })

    if (module) {
      revalidatePath(`/teacher/content/edit-course/${module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to delete module:", error)
    return { error: "Failed to delete module. Please try again." }
  }
}

// Create lesson action
export async function createLesson(formData: FormData) {
  const validatedFields = LessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    moduleId: formData.get("moduleId"),
    contentType: formData.get("contentType"),
    estimatedDuration: formData.get("estimatedDuration"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, content, moduleId, contentType, estimatedDuration } = validatedFields.data

  try {
    // Get the current highest sequence order
    const highestLesson = await prisma.lesson.findFirst({
      where: { module_id: moduleId },
      orderBy: { sequence_order: "desc" },
    })

    const sequenceOrder = highestLesson ? highestLesson.sequence_order + 1 : 1

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        module_id: moduleId,
        content_type: contentType,
        estimated_duration: estimatedDuration,
        sequence_order: sequenceOrder,
      },
    })

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { course_id: true },
    })

    if (module) {
      revalidatePath(`/teacher/content/edit-course/${module.course_id}`)
    }

    return { success: true, lessonId: lesson.id }
  } catch (error) {
    console.error("Failed to create lesson:", error)
    return { error: { server: "Failed to create lesson. Please try again." } }
  }
}

// Update lesson action
export async function updateLesson(lessonId: string, formData: FormData) {
  const validatedFields = LessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    moduleId: formData.get("moduleId"),
    contentType: formData.get("contentType"),
    estimatedDuration: formData.get("estimatedDuration"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, content, contentType, estimatedDuration } = validatedFields.data

  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        content,
        content_type: contentType,
        estimated_duration: estimatedDuration,
      },
    })

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { module: { select: { course_id: true } } },
    })

    if (lesson && lesson.module) {
      revalidatePath(`/teacher/content/edit-course/${lesson.module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update lesson:", error)
    return { error: { server: "Failed to update lesson. Please try again." } }
  }
}

// Delete lesson action
export async function deleteLesson(lessonId: string) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { module: { select: { course_id: true } } },
    })

    await prisma.lesson.delete({
      where: { id: lessonId },
    })

    if (lesson && lesson.module) {
      revalidatePath(`/teacher/content/edit-course/${lesson.module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to delete lesson:", error)
    return { error: "Failed to delete lesson. Please try again." }
  }
}

// Create resource action
export async function createResource(formData: FormData) {
  const validatedFields = ResourceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    resourceType: formData.get("resourceType"),
    url: formData.get("url"),
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, resourceType, url, content } = validatedFields.data
  const createdBy = formData.get("createdBy") as string

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        resource_type: resourceType,
        url: url || null,
        content: content || null,
        created_by: createdBy,
      },
    })

    revalidatePath("/teacher/content")
    return { success: true, resourceId: resource.id }
  } catch (error) {
    console.error("Failed to create resource:", error)
    return { error: { server: "Failed to create resource. Please try again." } }
  }
}

// Update resource action
export async function updateResource(resourceId: string, formData: FormData) {
  const validatedFields = ResourceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    resourceType: formData.get("resourceType"),
    url: formData.get("url"),
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description, resourceType, url, content } = validatedFields.data

  try {
    await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title,
        description,
        resource_type: resourceType,
        url: url || null,
        content: content || null,
      },
    })

    revalidatePath("/teacher/content")
    return { success: true }
  } catch (error) {
    console.error("Failed to update resource:", error)
    return { error: { server: "Failed to update resource. Please try again." } }
  }
}

// Delete resource action
export async function deleteResource(resourceId: string) {
  try {
    await prisma.resource.delete({
      where: { id: resourceId },
    })

    revalidatePath("/teacher/content")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete resource:", error)
    return { error: "Failed to delete resource. Please try again." }
  }
}

// Attach resource to lesson action
export async function attachResourceToLesson(formData: FormData) {
  const lessonId = formData.get("lessonId") as string
  const resourceId = formData.get("resourceId") as string

  if (!lessonId || !resourceId) {
    return { error: { server: "Lesson ID and Resource ID are required." } }
  }

  try {
    await prisma.lessonResource.create({
      data: {
        lesson_id: lessonId,
        resource_id: resourceId,
      },
    })

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { module: { select: { course_id: true } } },
    })

    if (lesson && lesson.module) {
      revalidatePath(`/teacher/content/edit-course/${lesson.module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to attach resource to lesson:", error)
    return { error: { server: "Failed to attach resource to lesson. Please try again." } }
  }
}

// Detach resource from lesson action
export async function detachResourceFromLesson(lessonId: string, resourceId: string) {
  try {
    await prisma.lessonResource.delete({
      where: {
        lesson_id_resource_id: {
          lesson_id: lessonId,
          resource_id: resourceId,
        },
      },
    })

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { module: { select: { course_id: true } } },
    })

    if (lesson && lesson.module) {
      revalidatePath(`/teacher/content/edit-course/${lesson.module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to detach resource from lesson:", error)
    return { error: "Failed to detach resource from lesson. Please try again." }
  }
}

// Reorder modules action
export async function reorderModules(courseId: string, moduleIds: string[]) {
  try {
    // Update each module's sequence order
    for (let i = 0; i < moduleIds.length; i++) {
      await prisma.module.update({
        where: { id: moduleIds[i] },
        data: { sequence_order: i + 1 },
      })
    }

    revalidatePath(`/teacher/content/edit-course/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to reorder modules:", error)
    return { error: "Failed to reorder modules. Please try again." }
  }
}

// Reorder lessons action
export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  try {
    // Update each lesson's sequence order
    for (let i = 0; i < lessonIds.length; i++) {
      await prisma.lesson.update({
        where: { id: lessonIds[i] },
        data: { sequence_order: i + 1 },
      })
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { course_id: true },
    })

    if (module) {
      revalidatePath(`/teacher/content/edit-course/${module.course_id}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to reorder lessons:", error)
    return { error: "Failed to reorder lessons. Please try again." }
  }
}
