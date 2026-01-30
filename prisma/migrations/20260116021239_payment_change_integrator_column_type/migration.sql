/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `plan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "integrator_id" SET DATA TYPE TEXT;

