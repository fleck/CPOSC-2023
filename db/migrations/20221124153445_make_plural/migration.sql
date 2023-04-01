/*
  Warnings:

  - You are about to drop the column `hostname` on the `PropertyTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PropertyTemplate" DROP COLUMN "hostname",
ADD COLUMN     "hostnames" TEXT[];
