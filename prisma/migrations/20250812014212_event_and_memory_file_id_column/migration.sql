/*
  Warnings:

  - You are about to drop the column `entity_id` on the `FileModel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_id]` on the table `MemoryModel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[file_id]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."FileModel" DROP COLUMN "entity_id";

-- AlterTable
ALTER TABLE "public"."MemoryModel" ADD COLUMN     "file_id" UUID;

-- AlterTable
ALTER TABLE "public"."event" ADD COLUMN     "file_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "MemoryModel_file_id_key" ON "public"."MemoryModel"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "event_file_id_key" ON "public"."event"("file_id");

-- AddForeignKey
ALTER TABLE "public"."event" ADD CONSTRAINT "event_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."FileModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MemoryModel" ADD CONSTRAINT "MemoryModel_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."FileModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
