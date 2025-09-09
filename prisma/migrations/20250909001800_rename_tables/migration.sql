/*
  Warnings:

  - You are about to drop the `FileModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemoryModel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MemoryModel" DROP CONSTRAINT "MemoryModel_event_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MemoryModel" DROP CONSTRAINT "MemoryModel_file_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."event" DROP CONSTRAINT "event_file_id_fkey";

-- DropTable
DROP TABLE "public"."FileModel";

-- DropTable
DROP TABLE "public"."MemoryModel";

-- CreateTable
CREATE TABLE "public"."memory" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "file_id" UUID,
    "identifier" TEXT,
    "description" TEXT,
    "ip_address" TEXT NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "memory_file_id_key" ON "public"."memory"("file_id");

-- AddForeignKey
ALTER TABLE "public"."event" ADD CONSTRAINT "event_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."memory" ADD CONSTRAINT "memory_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."memory" ADD CONSTRAINT "memory_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
