-- CreateTable
CREATE TABLE "_ItemImports" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemImports_AB_unique" ON "_ItemImports"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemImports_B_index" ON "_ItemImports"("B");

-- AddForeignKey
ALTER TABLE "_ItemImports" ADD FOREIGN KEY ("A") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemImports" ADD FOREIGN KEY ("B") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
