/*
  Warnings:

  - Made the column `align` on table `comparison_columns` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "comparison_columns" ALTER COLUMN "align" SET NOT NULL,
ALTER COLUMN "align" SET DEFAULT E'LEFT';
