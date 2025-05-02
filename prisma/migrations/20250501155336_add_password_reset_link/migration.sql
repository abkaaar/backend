-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetTokenExpire" TIMESTAMP(3);
