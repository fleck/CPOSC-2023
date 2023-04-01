/*
  Warnings:

  - Made the column `name` on table `data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "data" ALTER COLUMN "name" SET NOT NULL;
