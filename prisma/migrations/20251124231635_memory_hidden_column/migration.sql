/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "memory" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false;


