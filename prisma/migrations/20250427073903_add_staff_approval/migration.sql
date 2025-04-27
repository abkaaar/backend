/*
  Warnings:

  - Added the required column `updatedAt` to the `Approval` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Approval" DROP CONSTRAINT "Approval_staffId_fkey";

-- AlterTable
ALTER TABLE "Approval" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "staffId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Approval" ADD CONSTRAINT "Approval_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
