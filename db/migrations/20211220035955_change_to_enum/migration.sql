/*
  Warnings:

  - Changed the type of `title_type` on the `children` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TitleType" AS ENUM ('SPECIFIC', 'GENERIC');

-- AlterTable
alter table "children" 
  alter "title_type" type "TitleType"
  using 
     case "title_type" 
        when 0 then 'SPECIFIC' 
        when 1 then 'GENERIC' 
     end :: "TitleType";

