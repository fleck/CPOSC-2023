/*
  Warnings:

  - You are about to drop the column `index_error` on the `data` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "data" DROP COLUMN "index_error",
ADD COLUMN     "indexError" TEXT NOT NULL DEFAULT E'';
