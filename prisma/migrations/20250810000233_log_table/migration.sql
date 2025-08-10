-- CreateTable
CREATE TABLE "public"."log" (
    "id" UUID NOT NULL,
    "request_id" UUID,
    "event_id" UUID,
    "metadata" JSONB NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'info',
    "service" TEXT NOT NULL,
    "method" TEXT,
    "error_status" INTEGER,
    "error_message" TEXT,
    "error_stack" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);
