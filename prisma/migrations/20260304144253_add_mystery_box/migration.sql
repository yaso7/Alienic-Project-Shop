-- CreateEnum
CREATE TYPE "AdminUserStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "BundleSizeEnum" AS ENUM ('Small', 'Medium', 'Large');

-- CreateEnum
CREATE TYPE "DesignEnum" AS ENUM ('Classic', 'Modern', 'Vintage', 'Custom');

-- CreateEnum
CREATE TYPE "StyleEnum" AS ENUM ('Minimalist', 'Elegant', 'Casual', 'Formal');

-- CreateEnum
CREATE TYPE "MysteryBoxStatus" AS ENUM ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled');

-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN     "status" "AdminUserStatus" NOT NULL DEFAULT 'Inactive';

-- CreateTable
CREATE TABLE "mystery_boxes" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "bundleSize" "BundleSizeEnum" NOT NULL,
    "design" "DesignEnum" NOT NULL,
    "style" "StyleEnum" NOT NULL,
    "neckMeasurements" VARCHAR(100),
    "wristMeasurements" VARCHAR(100),
    "colorPreference" VARCHAR(255),
    "notes" TEXT,
    "status" "MysteryBoxStatus" NOT NULL DEFAULT 'Pending',
    "username" VARCHAR(255),
    "price" DECIMAL(10,2) NOT NULL DEFAULT 148.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mystery_boxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_mystery_boxes_created_at" ON "mystery_boxes"("createdAt");

-- CreateIndex
CREATE INDEX "idx_mystery_boxes_status" ON "mystery_boxes"("status");

-- CreateIndex
CREATE INDEX "idx_mystery_boxes_username" ON "mystery_boxes"("username");
