/*
  Warnings:

  - You are about to drop the `_ComparisonColumnToItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ComparisonColumnToItem" DROP CONSTRAINT "_ComparisonColumnToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_ComparisonColumnToItem" DROP CONSTRAINT "_ComparisonColumnToItem_B_fkey";

-- DropTable
DROP TABLE "_ComparisonColumnToItem";
