/*
  Warnings:

  - You are about to drop the column `postProcessor` on the `indexers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "indexers" DROP COLUMN "postProcessor",
ADD COLUMN     "replacements" JSONB NOT NULL DEFAULT E'[]';
