/*
  Warnings:

  - Made the column `text` on table `data` required. This step will fail if there are existing NULL values in that column.

*/
UPDATE "data" SET "text" = '' WHERE "text" IS NULL;

-- AlterTable
ALTER TABLE "data" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "text" SET DEFAULT E'';
