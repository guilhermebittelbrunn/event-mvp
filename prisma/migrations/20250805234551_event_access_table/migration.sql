-- CreateTable
CREATE TABLE "public"."event_access" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'guest',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "event_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_access_url_key" ON "public"."event_access"("url");

-- AddForeignKey
ALTER TABLE "public"."event_access" ADD CONSTRAINT "event_access_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
