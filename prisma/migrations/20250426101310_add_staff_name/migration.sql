/*
  Warnings:

  - Added the required column `name` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;
