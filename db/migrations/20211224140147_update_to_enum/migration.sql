/*
  Warnings:

  - The `align` column on the `comparison_columns` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Align" AS ENUM ('LEFT', 'CENTER', 'RIGHT');

-- AlterTable
alter table "comparison_columns" 
  alter "align" type "Align"
  using 
     case "align" 
        when 0 then 'LEFT' 
        when 1 then 'CENTER' 
        when 2 then 'RIGHT' 
        else 'LEFT'
     end :: "Align";
