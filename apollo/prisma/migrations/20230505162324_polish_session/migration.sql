/*
  Warnings:

  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expire_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `session_token` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sess]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expire` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sess` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - The required column `sid` was added to the `sessions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "sessions_session_token_key";

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "expire_at",
DROP COLUMN "id",
DROP COLUMN "session_token",
ADD COLUMN     "expire" INTEGER NOT NULL,
ADD COLUMN     "sess" JSONB NOT NULL,
ADD COLUMN     "sid" TEXT NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sid");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sess_key" ON "sessions"("sess");
