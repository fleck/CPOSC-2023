/*
  Warnings:

  - You are about to drop the `CachedUrls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CachedUrlsToItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CachedUrlsToItem" DROP CONSTRAINT "_CachedUrlsToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_CachedUrlsToItem" DROP CONSTRAINT "_CachedUrlsToItem_B_fkey";

-- DropTable
DROP TABLE "CachedUrls";

-- DropTable
DROP TABLE "_CachedUrlsToItem";

-- CreateTable
CREATE TABLE "CachedUrl" (
    "id" BIGSERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CachedUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CachedUrlToItem" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedUrl_url_key" ON "CachedUrl"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_CachedUrlToItem_AB_unique" ON "_CachedUrlToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CachedUrlToItem_B_index" ON "_CachedUrlToItem"("B");

-- AddForeignKey
ALTER TABLE "_CachedUrlToItem" ADD FOREIGN KEY ("A") REFERENCES "CachedUrl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CachedUrlToItem" ADD FOREIGN KEY ("B") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
