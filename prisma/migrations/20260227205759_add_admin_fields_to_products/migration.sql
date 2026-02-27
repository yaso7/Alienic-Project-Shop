-- AlterEnum
ALTER TYPE "OrderSource" ADD VALUE 'Site';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "addedBy" TEXT,
ADD COLUMN     "madeBy" TEXT;
