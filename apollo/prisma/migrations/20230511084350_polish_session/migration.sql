/*
  Warnings:

  - Changed the type of `expire` on the `sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "expire",
ADD COLUMN     "expire" TIMESTAMPTZ(6) NOT NULL;
