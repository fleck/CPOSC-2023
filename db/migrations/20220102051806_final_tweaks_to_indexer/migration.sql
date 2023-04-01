/*
  Warnings:

  - Made the column `searchParams` on table `indexers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "indexers" ALTER COLUMN "searchParams" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
