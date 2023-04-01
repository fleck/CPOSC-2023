/*
  Warnings:

  - The `hostname` column on the `PropertyTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PropertyTemplate" DROP COLUMN "hostname",
ADD COLUMN     "hostname" TEXT[];
