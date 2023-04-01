/*
  Warnings:

  - The `type` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('COMPARISON', 'PAGE', 'LIST', 'TEXT');

alter table "items" 
  alter "type" type "ItemType"
  using 
     case "type" 
        when 0 then 'COMPARISON' 
        when 1 then 'PAGE' 
        when 2 then 'LIST' 
        when 3 then 'TEXT'
     end :: "ItemType";
