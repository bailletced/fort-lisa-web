/*
  Warnings:

  - The primary key for the `OperationStore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `operationId` on the `OperationStore` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OperationStore` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `operation_id` to the `OperationStore` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EAccountProvider" AS ENUM ('FACEBOOK', 'GOOGLE');

-- DropIndex
DROP INDEX "OperationStore_operationId_idx";

-- AlterTable
ALTER TABLE "OperationStore" DROP CONSTRAINT "OperationStore_pkey",
DROP COLUMN "operationId",
DROP COLUMN "updatedAt",
ADD COLUMN     "operation_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD CONSTRAINT "OperationStore_pkey" PRIMARY KEY ("operation_id");

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "last_connection_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "account_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "EAccountProvider" NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expire_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE INDEX "OperationStore_operation_id_idx" ON "OperationStore"("operation_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
