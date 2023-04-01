/*
  Warnings:

  - Made the column `standalone` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "standalone" SET NOT NULL;
