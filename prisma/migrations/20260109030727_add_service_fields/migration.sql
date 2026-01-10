/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."services" ADD COLUMN     "color" TEXT DEFAULT '#3B82F6',
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "public"."services"("slug");
