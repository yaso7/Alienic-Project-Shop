-- Drop the problematic style column that shouldn't exist
ALTER TABLE "mystery_boxes" DROP COLUMN IF EXISTS "style";
