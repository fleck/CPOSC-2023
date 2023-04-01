-- CreateTable
CREATE TABLE "CachedUrls" (
    "id" BIGSERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "CachedUrls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CachedUrlsToItem" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CachedUrls_url_key" ON "CachedUrls"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_CachedUrlsToItem_AB_unique" ON "_CachedUrlsToItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CachedUrlsToItem_B_index" ON "_CachedUrlsToItem"("B");

-- AddForeignKey
ALTER TABLE "_CachedUrlsToItem" ADD FOREIGN KEY ("A") REFERENCES "CachedUrls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CachedUrlsToItem" ADD FOREIGN KEY ("B") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
