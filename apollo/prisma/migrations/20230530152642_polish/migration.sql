/*
  Warnings:

  - You are about to drop the column `feature_id` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission_set_user_subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[permission_set_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "permission_set_user_subscriptions" DROP CONSTRAINT "permission_set_user_subscriptions_permission_set_id_fkey";

-- DropForeignKey
ALTER TABLE "permission_set_user_subscriptions" DROP CONSTRAINT "permission_set_user_subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_feature_id_fkey";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "feature_id",
DROP COLUMN "order",
ADD COLUMN     "feature" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "permission_set_id" TEXT;

-- DropTable
DROP TABLE "features";

-- DropTable
DROP TABLE "permission_set_user_subscriptions";

-- CreateIndex
CREATE UNIQUE INDEX "users_permission_set_id_key" ON "users"("permission_set_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_permission_set_id_fkey" FOREIGN KEY ("permission_set_id") REFERENCES "permission_sets"("permission_set_id") ON DELETE SET NULL ON UPDATE CASCADE;
