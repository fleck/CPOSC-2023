-- CreateTable
CREATE TABLE "Redirect" (
    "id" SERIAL NOT NULL,
    "from" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_from_key" ON "Redirect"("from");

-- AddForeignKey
ALTER TABLE "Redirect" ADD CONSTRAINT "Redirect_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
