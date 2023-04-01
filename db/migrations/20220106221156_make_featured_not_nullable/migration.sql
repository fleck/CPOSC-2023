/*
  Warnings:

  - Made the column `featured` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
UPDATE "properties" SET "featured" = false WHERE "featured" IS NULL;
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "featured" SET NOT NULL,
ALTER COLUMN "featured" SET DEFAULT false;
