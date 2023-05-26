/*
  Warnings:

  - You are about to drop the column `user_id` on the `sessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "UserSessionSubscription" (
    "user_session_subscription_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "UserSessionSubscription_pkey" PRIMARY KEY ("user_session_subscription_id")
);

-- AddForeignKey
ALTER TABLE "UserSessionSubscription" ADD CONSTRAINT "UserSessionSubscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSessionSubscription" ADD CONSTRAINT "UserSessionSubscription_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("sid") ON DELETE CASCADE ON UPDATE CASCADE;
