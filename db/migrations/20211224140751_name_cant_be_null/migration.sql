/*
  Warnings:

  - Made the column `name` on table `comparison_columns` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "comparison_columns" ALTER COLUMN "name" SET NOT NULL;
