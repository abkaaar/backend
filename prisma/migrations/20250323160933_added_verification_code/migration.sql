-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationCodeExpire" TIMESTAMP(3);
