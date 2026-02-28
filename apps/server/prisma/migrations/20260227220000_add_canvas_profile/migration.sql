-- AlterTable: add Canvas profile fields to User
ALTER TABLE "User" ADD COLUMN "canvasName" TEXT;
ALTER TABLE "User" ADD COLUMN "canvasAvatarUrl" TEXT;
