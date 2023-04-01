/*
  Warnings:

  - You are about to drop the column `api_id` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `click` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `decimal_places` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `decode_url` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `divide_by` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `index_type` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `keep_old_value` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `path_extension` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `post_processor` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `query_params` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `request_headers` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `second_indexer_id` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `second_selector` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `seconds_between_updates` on the `indexers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `indexers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fallbackIndexerId]` on the table `indexers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `indexers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hostname` on table `indexers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `selector` on table `indexers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cookie` on table `indexers` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "indexers" SET "selector" = '' WHERE "selector" IS NULL;
UPDATE "indexers" SET "cookie" = '' WHERE "cookie" IS NULL;

-- CreateEnum
CREATE TYPE "IndexerType" AS ENUM ('CSS', 'XPATH', 'JSON', 'TEXT');

-- DropForeignKey
ALTER TABLE "indexers" DROP CONSTRAINT "indexers_api_id_fkey";

-- DropIndex
DROP INDEX "index_indexers_on_api_id";

-- AlterTable
ALTER TABLE "indexers" DROP COLUMN "api_id",
DROP COLUMN "browser",
DROP COLUMN "click",
DROP COLUMN "created_at",
DROP COLUMN "decimal_places",
DROP COLUMN "decode_url",
DROP COLUMN "divide_by",
DROP COLUMN "index_type",
DROP COLUMN "keep_old_value",
DROP COLUMN "path_extension",
DROP COLUMN "post_processor",
DROP COLUMN "query_params",
DROP COLUMN "request_headers",
DROP COLUMN "second_indexer_id",
DROP COLUMN "second_selector",
DROP COLUMN "seconds_between_updates",
DROP COLUMN "updated_at",
ADD COLUMN     "apiId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "decimalPlaces" INTEGER,
ADD COLUMN     "decodeUrl" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "divideBy" INTEGER,
ADD COLUMN     "fallbackIndexerId" INTEGER,
ADD COLUMN     "indexType" "IndexerType" NOT NULL DEFAULT E'CSS',
ADD COLUMN     "keepOldValue" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pathExtension" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "postProcessor" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "requestHeaders" JSONB NOT NULL DEFAULT E'{}',
ADD COLUMN     "searchParams" JSONB DEFAULT E'{}',
ADD COLUMN     "secondsBetweenUpdates" INTEGER NOT NULL DEFAULT 39600,
ADD COLUMN     "selectorToClick" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "hostname" SET NOT NULL,
ALTER COLUMN "hostname" SET DATA TYPE TEXT,
ALTER COLUMN "selector" SET NOT NULL,
ALTER COLUMN "selector" SET DEFAULT E'',
ALTER COLUMN "cookie" SET NOT NULL,
ALTER COLUMN "cookie" SET DEFAULT E'';

-- CreateIndex
CREATE UNIQUE INDEX "indexers_fallbackIndexerId_key" ON "indexers"("fallbackIndexerId");

-- CreateIndex
CREATE INDEX "index_indexers_on_api_id" ON "indexers"("apiId");

-- AddForeignKey
ALTER TABLE "indexers" ADD CONSTRAINT "indexers_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "apis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indexers" ADD CONSTRAINT "indexers_fallbackIndexerId_fkey" FOREIGN KEY ("fallbackIndexerId") REFERENCES "indexers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
