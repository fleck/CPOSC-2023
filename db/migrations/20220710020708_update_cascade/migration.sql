-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_item_id_fkey";

-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "comparison_columns" DROP CONSTRAINT "comparison_columns_item_id_fkey";

-- AddForeignKey
ALTER TABLE "comparison_columns" ADD CONSTRAINT "comparison_columns_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
