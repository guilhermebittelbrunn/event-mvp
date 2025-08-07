-- CreateTable
CREATE TABLE "public"."MemoryModel" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "identifier" TEXT,
    "description" TEXT,
    "ip_address" TEXT NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "MemoryModel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MemoryModel" ADD CONSTRAINT "MemoryModel_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
