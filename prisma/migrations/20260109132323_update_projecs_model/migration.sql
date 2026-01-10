-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "challenges" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "results" JSONB,
ADD COLUMN     "screenshots" JSONB,
ADD COLUMN     "solutions" JSONB,
ADD COLUMN     "technologies" JSONB,
ADD COLUMN     "testimonial" JSONB;
