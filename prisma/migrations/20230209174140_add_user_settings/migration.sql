-- AlterTable
ALTER TABLE "Trackable" ALTER COLUMN "settings" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}';
