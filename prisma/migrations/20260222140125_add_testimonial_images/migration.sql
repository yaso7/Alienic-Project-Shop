/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `testimonials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "imageId" TEXT;

-- CreateTable
CREATE TABLE "testimonial_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonial_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "testimonials_imageId_key" ON "testimonials"("imageId");

-- AddForeignKey
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "testimonial_images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
