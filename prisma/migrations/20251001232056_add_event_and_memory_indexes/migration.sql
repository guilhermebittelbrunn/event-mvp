/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/

-- Remove o índice único atual se existir
DROP INDEX IF EXISTS "event_slug_key";

-- Cria um índice único parcial que só considera registros não deletados
CREATE UNIQUE INDEX "event_slug_unique_active" 
ON "event" ("slug") 
WHERE "deleted_at" IS NULL;

-- CreateIndex
CREATE INDEX "event_user_id_idx" ON "event"("user_id");

-- CreateIndex
CREATE INDEX "event_slug_idx" ON "event"("slug");

-- CreateIndex
CREATE INDEX "event_created_at_idx" ON "event"("created_at");

-- CreateIndex
CREATE INDEX "event_access_event_id_idx" ON "event_access"("event_id");

-- CreateIndex
CREATE INDEX "event_access_event_id_type_idx" ON "event_access"("event_id", "type");

-- CreateIndex
CREATE INDEX "event_config_event_id_deleted_at_idx" ON "event_config"("event_id", "deleted_at");

-- CreateIndex
CREATE INDEX "memory_event_id_idx" ON "memory"("event_id");

-- CreateIndex
CREATE INDEX "memory_created_at_idx" ON "memory"("created_at");