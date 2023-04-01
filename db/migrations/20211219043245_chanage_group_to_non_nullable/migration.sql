/*
  Warnings:

  - Made the column `group` on table `data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "data" ALTER COLUMN "group" SET NOT NULL;
