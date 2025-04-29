-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('POSITIVE', 'CONSTRUCTIVE', 'QUESTION', 'SUGGESTION');

-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login" TIMESTAMP WITH TIME ZONE;

-- CreateTable
CREATE TABLE "teacher_notes" (
    "id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "teacher_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_feedback" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "feedback_type" "FeedbackType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_students" (
    "class_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_students_pkey" PRIMARY KEY ("class_id","student_id")
);

-- CreateTable
CREATE TABLE "class_courses" (
    "class_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_courses_pkey" PRIMARY KEY ("class_id","course_id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "class_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_performance" (
    "id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "course_id" UUID,
    "class_id" UUID,
    "quiz_average" DOUBLE PRECISION,
    "completion_rate" DOUBLE PRECISION,
    "engagement_score" DOUBLE PRECISION,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teaching_activities" (
    "id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "activity_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teaching_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_objectives" (
    "id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "success_criteria" TEXT,
    "sequence_order" INTEGER NOT NULL,

    CONSTRAINT "learning_objectives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "teacher_notes_teacher_id_idx" ON "teacher_notes"("teacher_id");

-- CreateIndex
CREATE INDEX "teacher_notes_student_id_idx" ON "teacher_notes"("student_id");

-- CreateIndex
CREATE INDEX "student_feedback_student_id_idx" ON "student_feedback"("student_id");

-- CreateIndex
CREATE INDEX "student_feedback_teacher_id_idx" ON "student_feedback"("teacher_id");

-- CreateIndex
CREATE INDEX "classes_teacher_id_idx" ON "classes"("teacher_id");

-- CreateIndex
CREATE INDEX "classes_subject_id_idx" ON "classes"("subject_id");

-- CreateIndex
CREATE INDEX "class_students_class_id_idx" ON "class_students"("class_id");

-- CreateIndex
CREATE INDEX "class_students_student_id_idx" ON "class_students"("student_id");

-- CreateIndex
CREATE INDEX "class_courses_class_id_idx" ON "class_courses"("class_id");

-- CreateIndex
CREATE INDEX "class_courses_course_id_idx" ON "class_courses"("course_id");

-- CreateIndex
CREATE INDEX "announcements_class_id_idx" ON "announcements"("class_id");

-- CreateIndex
CREATE INDEX "announcements_teacher_id_idx" ON "announcements"("teacher_id");

-- CreateIndex
CREATE INDEX "student_performance_student_id_idx" ON "student_performance"("student_id");

-- CreateIndex
CREATE INDEX "student_performance_course_id_idx" ON "student_performance"("course_id");

-- CreateIndex
CREATE INDEX "student_performance_class_id_idx" ON "student_performance"("class_id");

-- CreateIndex
CREATE INDEX "student_performance_recorded_at_idx" ON "student_performance"("recorded_at");

-- CreateIndex
CREATE INDEX "teaching_activities_teacher_id_idx" ON "teaching_activities"("teacher_id");

-- CreateIndex
CREATE INDEX "teaching_activities_activity_type_idx" ON "teaching_activities"("activity_type");

-- CreateIndex
CREATE INDEX "teaching_activities_created_at_idx" ON "teaching_activities"("created_at");

-- CreateIndex
CREATE INDEX "learning_objectives_plan_id_idx" ON "learning_objectives"("plan_id");

-- AddForeignKey
ALTER TABLE "teacher_notes" ADD CONSTRAINT "teacher_notes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_notes" ADD CONSTRAINT "teacher_notes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_feedback" ADD CONSTRAINT "student_feedback_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_feedback" ADD CONSTRAINT "student_feedback_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_students" ADD CONSTRAINT "class_students_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_students" ADD CONSTRAINT "class_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_courses" ADD CONSTRAINT "class_courses_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_courses" ADD CONSTRAINT "class_courses_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_objectives" ADD CONSTRAINT "learning_objectives_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "learning_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
