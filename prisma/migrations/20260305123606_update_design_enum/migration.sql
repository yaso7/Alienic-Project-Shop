/*
  Warnings:

  - The values [Classic,Modern,Vintage,Custom] on the enum `DesignEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DesignEnum_new" AS ENUM ('Simple', 'Extra', 'IDontCare');
ALTER TABLE "mystery_boxes" ALTER COLUMN "design" TYPE "DesignEnum_new" USING ("design"::text::"DesignEnum_new");
ALTER TYPE "DesignEnum" RENAME TO "DesignEnum_old";
ALTER TYPE "DesignEnum_new" RENAME TO "DesignEnum";
DROP TYPE "public"."DesignEnum_old";
COMMIT;
