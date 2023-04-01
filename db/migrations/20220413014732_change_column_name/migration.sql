/*
  Warnings:

  - You are about to drop the column `fallbackIndexerId` on the `indexers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nextIndexerId]` on the table `indexers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "indexers" DROP CONSTRAINT "indexers_fallbackIndexerId_fkey";

-- DropIndex
DROP INDEX "indexers_fallbackIndexerId_key";

-- AlterTable
ALTER TABLE "indexers" DROP COLUMN "fallbackIndexerId",
ADD COLUMN     "nextIndexerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "indexers_nextIndexerId_key" ON "indexers"("nextIndexerId");

-- AddForeignKey
ALTER TABLE "indexers" ADD CONSTRAINT "indexers_nextIndexerId_fkey" FOREIGN KEY ("nextIndexerId") REFERENCES "indexers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
