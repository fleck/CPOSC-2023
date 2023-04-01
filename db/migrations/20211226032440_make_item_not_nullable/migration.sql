/*
  Warnings:

  - Made the column `item_id` on table `comparison_columns` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comparison_columns" DROP CONSTRAINT "comparison_columns_item_id_fkey";

-- AlterTable
ALTER TABLE "comparison_columns" ALTER COLUMN "item_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "_ComparisonColumnToItem" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ComparisonColumnToItem_AB_unique" ON "_ComparisonColumnToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ComparisonColumnToItem_B_index" ON "_ComparisonColumnToItem"("B");

-- AddForeignKey
ALTER TABLE "comparison_columns" ADD CONSTRAINT "comparison_columns_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComparisonColumnToItem" ADD FOREIGN KEY ("A") REFERENCES "comparison_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComparisonColumnToItem" ADD FOREIGN KEY ("B") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
