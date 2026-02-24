/*
  Warnings:

  - Added the required column `priceNumeric` to the `products` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add the column as nullable
ALTER TABLE "products" ADD COLUMN "priceNumeric" DOUBLE PRECISION;

-- Step 2: Populate the column with values from the price field
UPDATE "products" 
SET "priceNumeric" = CAST(REGEXP_REPLACE(REPLACE("price", '$', ''), '[^0-9.]', '', 'g') AS DOUBLE PRECISION)
WHERE "price" IS NOT NULL AND "price" != '';

-- Step 3: Make the column non-null
ALTER TABLE "products" ALTER COLUMN "priceNumeric" SET NOT NULL;
