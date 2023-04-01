/*
  Warnings:

  - Made the column `created_at` on table `properties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);
