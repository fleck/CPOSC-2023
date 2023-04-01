-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_item_id_fkey";

-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_datum_id_fkey";

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "type" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_datum_id_fkey" FOREIGN KEY ("datum_id") REFERENCES "data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Cache.key_unique" RENAME TO "Cache_key_key";

-- RenameIndex
ALTER INDEX "File.hash_unique" RENAME TO "File_hash_key";

-- RenameIndex
ALTER INDEX "File.key_unique" RENAME TO "File_key_key";

-- RenameIndex
ALTER INDEX "Session.handle_unique" RENAME TO "Session_handle_key";

-- RenameIndex
ALTER INDEX "Setting.key_unique" RENAME TO "Setting_key_key";

-- RenameIndex
ALTER INDEX "Token.hashedToken_type_unique" RENAME TO "Token_hashedToken_type_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "index_embeds_on_url_and_query_params" RENAME TO "embeds_url_query_params_key";

-- RenameIndex
ALTER INDEX "index_items_on_url_and_domain_id" RENAME TO "items_url_domain_id_key";
