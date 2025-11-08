/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `sub_tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sub_tasks" DROP COLUMN "isCompleted",
ADD COLUMN     "is_completed" BOOLEAN DEFAULT false;
