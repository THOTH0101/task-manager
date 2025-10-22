-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "TaskStage" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('ASSIGNED', 'STARTED', 'IN_PROGRESS', 'BUG', 'COMPLETED', 'COMMENTED');

-- CreateEnum
CREATE TYPE "NoticeType" AS ENUM ('ALERT', 'MESSAGE');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "manager_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "task_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" "TaskPriority" NOT NULL DEFAULT 'NORMAL',
    "stage" "TaskStage" NOT NULL DEFAULT 'TODO',
    "assets" TEXT[],
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "task_activities" (
    "activity_id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL DEFAULT 'ASSIGNED',
    "activity" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "by_user_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "task_activities_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "sub_tasks" (
    "sub_task_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "tag" TEXT,
    "task_id" TEXT NOT NULL,

    CONSTRAINT "sub_tasks_pkey" PRIMARY KEY ("sub_task_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notice_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "notice_type" "NoticeType" NOT NULL DEFAULT 'ALERT',
    "task_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notice_id")
);

-- CreateTable
CREATE TABLE "_TeamAssignments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamAssignments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NoticeTeamRecipients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NoticeTeamRecipients_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NoticeReadStatus" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NoticeReadStatus_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "_TeamAssignments_B_index" ON "_TeamAssignments"("B");

-- CreateIndex
CREATE INDEX "_NoticeTeamRecipients_B_index" ON "_NoticeTeamRecipients"("B");

-- CreateIndex
CREATE INDEX "_NoticeReadStatus_B_index" ON "_NoticeReadStatus"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_activities" ADD CONSTRAINT "task_activities_by_user_id_fkey" FOREIGN KEY ("by_user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_activities" ADD CONSTRAINT "task_activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_tasks" ADD CONSTRAINT "sub_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamAssignments" ADD CONSTRAINT "_TeamAssignments_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamAssignments" ADD CONSTRAINT "_TeamAssignments_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoticeTeamRecipients" ADD CONSTRAINT "_NoticeTeamRecipients_A_fkey" FOREIGN KEY ("A") REFERENCES "notifications"("notice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoticeTeamRecipients" ADD CONSTRAINT "_NoticeTeamRecipients_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoticeReadStatus" ADD CONSTRAINT "_NoticeReadStatus_A_fkey" FOREIGN KEY ("A") REFERENCES "notifications"("notice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NoticeReadStatus" ADD CONSTRAINT "_NoticeReadStatus_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
