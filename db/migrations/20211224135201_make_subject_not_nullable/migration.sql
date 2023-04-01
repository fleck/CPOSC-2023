/*
  Warnings:

  - Made the column `subject` on table `comparison_columns` required. This step will fail if there are existing NULL values in that column.

*/
UPDATE "comparison_columns" SET "subject" = false WHERE "subject" IS NULL;
-- AlterTable
ALTER TABLE "comparison_columns" ALTER COLUMN "subject" SET NOT NULL;
