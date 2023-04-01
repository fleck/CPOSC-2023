/*
  Warnings:

  - Made the column `url` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `prefix` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postfix` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `global` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `index_error` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `affiliate_link` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `force_digits_after_decimal` on table `data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_index_response` on table `data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
UPDATE "data" SET "url" = '' WHERE "url" IS NULL;
UPDATE "data" SET "prefix" = '' WHERE "prefix" IS NULL;
UPDATE "data" SET "postfix" = '' WHERE "postfix" IS NULL;
UPDATE "data" SET "global" = false WHERE "global" IS NULL;
UPDATE "data" SET "index_error" = '' WHERE "index_error" IS NULL;
UPDATE "data" SET "affiliate_link" = '' WHERE "affiliate_link" IS NULL;
UPDATE "data" SET "force_digits_after_decimal" = false WHERE "force_digits_after_decimal" IS NULL;
UPDATE "data" SET "last_index_response" = '' WHERE "last_index_response" IS NULL;

ALTER TABLE "data" ALTER COLUMN "url" SET NOT NULL,
ALTER COLUMN "url" SET DEFAULT E'',
ALTER COLUMN "url" SET DATA TYPE TEXT,
ALTER COLUMN "prefix" SET NOT NULL,
ALTER COLUMN "prefix" SET DEFAULT E'',
ALTER COLUMN "prefix" SET DATA TYPE TEXT,
ALTER COLUMN "postfix" SET NOT NULL,
ALTER COLUMN "postfix" SET DEFAULT E'',
ALTER COLUMN "postfix" SET DATA TYPE TEXT,
ALTER COLUMN "global" SET NOT NULL,
ALTER COLUMN "global" SET DEFAULT false,
ALTER COLUMN "index_error" SET NOT NULL,
ALTER COLUMN "index_error" SET DEFAULT E'',
ALTER COLUMN "affiliate_link" SET NOT NULL,
ALTER COLUMN "affiliate_link" SET DEFAULT E'',
ALTER COLUMN "affiliate_link" SET DATA TYPE TEXT,
ALTER COLUMN "force_digits_after_decimal" SET NOT NULL,
ALTER COLUMN "force_digits_after_decimal" SET DEFAULT false,
ALTER COLUMN "last_index_response" SET NOT NULL,
ALTER COLUMN "last_index_response" SET DEFAULT E'';
