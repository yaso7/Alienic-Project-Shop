/*
  Warnings:

  - You are about to drop the column `productId` on the `testimonials` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_productId_fkey";

-- AlterTable
ALTER TABLE "testimonials" DROP COLUMN "productId",
ADD COLUMN     "pieceAcquired" TEXT;
