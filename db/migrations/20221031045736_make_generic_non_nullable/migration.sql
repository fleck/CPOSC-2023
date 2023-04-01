/*
  Warnings:

  - Made the column `generic_name` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "items" SET "generic_name" = '' WHERE "generic_name" IS NULL;

ALTER TABLE "items" ALTER COLUMN "generic_name" SET NOT NULL;
