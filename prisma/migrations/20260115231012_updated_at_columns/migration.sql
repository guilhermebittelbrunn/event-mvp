/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "event" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "event_access" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "event_config" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "memory" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;
