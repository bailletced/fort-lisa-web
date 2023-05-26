/*
  Warnings:

  - You are about to drop the column `session_id` on the `UserSessionSubscription` table. All the data in the column will be lost.
  - Added the required column `sess_id` to the `UserSessionSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSessionSubscription" DROP CONSTRAINT "UserSessionSubscription_session_id_fkey";

-- AlterTable
ALTER TABLE "UserSessionSubscription" DROP COLUMN "session_id",
ADD COLUMN     "sess_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSessionSubscription" ADD CONSTRAINT "UserSessionSubscription_sess_id_fkey" FOREIGN KEY ("sess_id") REFERENCES "sessions"("sid") ON DELETE CASCADE ON UPDATE CASCADE;
