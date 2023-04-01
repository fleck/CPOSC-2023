-- AlterTable
ALTER TABLE "CachedUrl" ADD COLUMN     "headers" JSONB NOT NULL DEFAULT '{}';
