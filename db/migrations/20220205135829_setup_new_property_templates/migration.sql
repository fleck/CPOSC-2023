/*
  Warnings:

  - You are about to drop the `properties_property_templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "properties_property_templates";

-- DropTable
DROP TABLE "property_templates";

-- CreateTable
CREATE TABLE "PropertyTemplate" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hostname" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "PropertyTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PropertyToPropertyTemplate" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PropertyToPropertyTemplate_AB_unique" ON "_PropertyToPropertyTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_PropertyToPropertyTemplate_B_index" ON "_PropertyToPropertyTemplate"("B");

-- AddForeignKey
ALTER TABLE "_PropertyToPropertyTemplate" ADD FOREIGN KEY ("A") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyToPropertyTemplate" ADD FOREIGN KEY ("B") REFERENCES "PropertyTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
