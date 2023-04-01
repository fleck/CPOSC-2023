/*
  Warnings:

  - You are about to drop the column `divideBy` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `selector` on the `indexers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "indexers" DROP COLUMN "divideBy",
DROP COLUMN "selector";
