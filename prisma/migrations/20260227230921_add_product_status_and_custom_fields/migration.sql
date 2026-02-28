/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('Available', 'NotAvailable', 'Archived', 'Draft');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "isAvailable",
ADD COLUMN     "customer" TEXT,
ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'Available';
