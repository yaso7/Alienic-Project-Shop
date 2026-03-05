-- CreateEnum
CREATE TYPE "StylePreferenceEnum" AS ENUM ('Masculine', 'Feminine', 'IDontCare');

-- AlterTable
ALTER TABLE "mystery_boxes" ADD COLUMN     "stylePreference" "StylePreferenceEnum" NOT NULL DEFAULT 'IDontCare';
