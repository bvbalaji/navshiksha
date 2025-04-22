/*
  Warnings:

  - The values [text,video,quiz,interactive] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.
  - The values [not_started,in_progress,completed] on the enum `ProgressStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [multiple_choice,true_false,short_answer,essay] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [document,video,link,image,audio] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,teacher,learner] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `plan_assignments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `description` on table `achievements` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `level` on the `courses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `subject_id` on table `learning_plans` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `level` to the `learning_plans` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `lessons` required. This step will fail if there are existing NULL values in that column.
  - Made the column `score` on table `quiz_attempts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passing_score` on table `quizzes` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('TEXT', 'VIDEO', 'INTERACTIVE', 'QUIZ');
ALTER TABLE "lessons" ALTER COLUMN "content_type" TYPE "ContentType_new" USING ("content_type"::text::"ContentType_new");
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "ContentType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProgressStatus_new" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "progress" ALTER COLUMN "status" TYPE "ProgressStatus_new" USING ("status"::text::"ProgressStatus_new");
ALTER TYPE "ProgressStatus" RENAME TO "ProgressStatus_old";
ALTER TYPE "ProgressStatus_new" RENAME TO "ProgressStatus";
DROP TYPE "ProgressStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY');
ALTER TABLE "quiz_questions" ALTER COLUMN "question_type" TYPE "QuestionType_new" USING ("question_type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('PDF', 'VIDEO', 'LINK', 'IMAGE', 'DOCUMENT', 'OTHER');
ALTER TABLE "resources" ALTER COLUMN "resource_type" TYPE "ResourceType_new" USING ("resource_type"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "ResourceType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ai_interactions" DROP CONSTRAINT "ai_interactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "analytics_events" DROP CONSTRAINT "analytics_events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "learning_plans" DROP CONSTRAINT "learning_plans_subject_id_fkey";

-- DropIndex
DROP INDEX "plan_assignments_plan_id_user_id_key";

-- DropIndex
DROP INDEX "quizzes_lesson_id_key";

-- DropIndex
DROP INDEX "subjects_name_key";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "achievements" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "ai_interactions" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "analytics_events" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "level",
ADD COLUMN     "level" "CourseLevel" NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "enrollments" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "learning_plans" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "subject_id" SET NOT NULL,
DROP COLUMN "level",
ADD COLUMN     "level" "CourseLevel" NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "lessons" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "modules" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "plan_assignments" ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "PlanStatus" NOT NULL DEFAULT 'ASSIGNED';

-- AlterTable
ALTER TABLE "progress" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "quiz_attempts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "score" SET NOT NULL;

-- AlterTable
ALTER TABLE "quiz_question_options" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "quiz_questions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "quiz_responses" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "passing_score" SET NOT NULL,
ALTER COLUMN "passing_score" SET DEFAULT 70,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "resources" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "subjects" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_achievements" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "hashed_password" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- DropEnum
DROP TYPE "AssignmentStatus";

-- DropEnum
DROP TYPE "Level";

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "ai_interactions_user_id_idx" ON "ai_interactions"("user_id");

-- CreateIndex
CREATE INDEX "ai_interactions_session_id_idx" ON "ai_interactions"("session_id");

-- CreateIndex
CREATE INDEX "ai_interactions_created_at_idx" ON "ai_interactions"("created_at");

-- CreateIndex
CREATE INDEX "analytics_events_user_id_idx" ON "analytics_events"("user_id");

-- CreateIndex
CREATE INDEX "analytics_events_event_type_idx" ON "analytics_events"("event_type");

-- CreateIndex
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events"("created_at");

-- CreateIndex
CREATE INDEX "courses_subject_id_idx" ON "courses"("subject_id");

-- CreateIndex
CREATE INDEX "courses_creator_id_idx" ON "courses"("creator_id");

-- CreateIndex
CREATE INDEX "courses_level_idx" ON "courses"("level");

-- CreateIndex
CREATE INDEX "courses_is_published_idx" ON "courses"("is_published");

-- CreateIndex
CREATE INDEX "enrollments_user_id_idx" ON "enrollments"("user_id");

-- CreateIndex
CREATE INDEX "enrollments_course_id_idx" ON "enrollments"("course_id");

-- CreateIndex
CREATE INDEX "enrollments_enrolled_at_idx" ON "enrollments"("enrolled_at");

-- CreateIndex
CREATE INDEX "learning_plans_subject_id_idx" ON "learning_plans"("subject_id");

-- CreateIndex
CREATE INDEX "learning_plans_created_by_idx" ON "learning_plans"("created_by");

-- CreateIndex
CREATE INDEX "learning_plans_is_template_idx" ON "learning_plans"("is_template");

-- CreateIndex
CREATE INDEX "lesson_resources_lesson_id_idx" ON "lesson_resources"("lesson_id");

-- CreateIndex
CREATE INDEX "lesson_resources_resource_id_idx" ON "lesson_resources"("resource_id");

-- CreateIndex
CREATE INDEX "lessons_module_id_idx" ON "lessons"("module_id");

-- CreateIndex
CREATE INDEX "lessons_module_id_sequence_order_idx" ON "lessons"("module_id", "sequence_order");

-- CreateIndex
CREATE INDEX "lessons_content_type_idx" ON "lessons"("content_type");

-- CreateIndex
CREATE INDEX "modules_course_id_idx" ON "modules"("course_id");

-- CreateIndex
CREATE INDEX "modules_course_id_sequence_order_idx" ON "modules"("course_id", "sequence_order");

-- CreateIndex
CREATE INDEX "plan_assignments_plan_id_idx" ON "plan_assignments"("plan_id");

-- CreateIndex
CREATE INDEX "plan_assignments_user_id_idx" ON "plan_assignments"("user_id");

-- CreateIndex
CREATE INDEX "plan_assignments_assigned_by_idx" ON "plan_assignments"("assigned_by");

-- CreateIndex
CREATE INDEX "plan_assignments_status_idx" ON "plan_assignments"("status");

-- CreateIndex
CREATE INDEX "progress_user_id_idx" ON "progress"("user_id");

-- CreateIndex
CREATE INDEX "progress_lesson_id_idx" ON "progress"("lesson_id");

-- CreateIndex
CREATE INDEX "progress_status_idx" ON "progress"("status");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_idx" ON "quiz_attempts"("user_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_quiz_id_idx" ON "quiz_attempts"("quiz_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_started_at_idx" ON "quiz_attempts"("started_at");

-- CreateIndex
CREATE INDEX "quiz_question_options_question_id_idx" ON "quiz_question_options"("question_id");

-- CreateIndex
CREATE INDEX "quiz_questions_quiz_id_idx" ON "quiz_questions"("quiz_id");

-- CreateIndex
CREATE INDEX "quiz_questions_quiz_id_sequence_order_idx" ON "quiz_questions"("quiz_id", "sequence_order");

-- CreateIndex
CREATE INDEX "quiz_responses_attempt_id_idx" ON "quiz_responses"("attempt_id");

-- CreateIndex
CREATE INDEX "quiz_responses_question_id_idx" ON "quiz_responses"("question_id");

-- CreateIndex
CREATE INDEX "quizzes_lesson_id_idx" ON "quizzes"("lesson_id");

-- CreateIndex
CREATE INDEX "resources_created_by_idx" ON "resources"("created_by");

-- CreateIndex
CREATE INDEX "resources_resource_type_idx" ON "resources"("resource_type");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "subjects_name_idx" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements"("user_id");

-- CreateIndex
CREATE INDEX "user_achievements_achievement_id_idx" ON "user_achievements"("achievement_id");

-- CreateIndex
CREATE INDEX "user_achievements_earned_at_idx" ON "user_achievements"("earned_at");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "learning_plans" ADD CONSTRAINT "learning_plans_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
