/*
  Warnings:

  - Made the column `updated_at` on table `data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "data" ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "data" ADD CONSTRAINT "data_indexer_id_fkey" FOREIGN KEY ("indexer_id") REFERENCES "indexers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
