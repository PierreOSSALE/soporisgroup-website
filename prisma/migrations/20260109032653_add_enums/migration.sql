/*
  Warnings:

  - The `status` column on the `appointments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('user', 'assistant', 'admin');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- AlterTable
ALTER TABLE "public"."appointments" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ProjectStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'user';
