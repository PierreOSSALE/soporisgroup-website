/*
  Warnings:

  - A unique constraint covering the columns `[cancellation_token]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."appointments" ADD COLUMN     "cancellation_token" TEXT,
ADD COLUMN     "reminder_sent" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_cancellation_token_key" ON "public"."appointments"("cancellation_token");
