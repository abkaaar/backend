/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Student` table. All the data in the column will be lost.
  - Added the required column `departmentName` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_departmentId_fkey";

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "departmentId",
ADD COLUMN     "departmentName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "departmentId";

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departmentName_fkey" FOREIGN KEY ("departmentName") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_departmentName_fkey" FOREIGN KEY ("departmentName") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
