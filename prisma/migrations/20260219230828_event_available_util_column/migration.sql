-- AlterTable
ALTER TABLE "event" ADD COLUMN "available_until" TIMESTAMP(3);

UPDATE "event" SET "available_until" = "end_at" WHERE "available_until" IS NULL;

ALTER TABLE "event" ALTER COLUMN "available_until" SET NOT NULL;

-- AlterTable
ALTER TABLE "plan" ADD COLUMN "access_days" INTEGER;

