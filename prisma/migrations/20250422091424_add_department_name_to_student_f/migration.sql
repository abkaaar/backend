/*
  Warnings:

  - Added the required column `name` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `departmentName` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "departmentName" SET NOT NULL;
