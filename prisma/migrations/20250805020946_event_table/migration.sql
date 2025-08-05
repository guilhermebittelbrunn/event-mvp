-- CreateTable
CREATE TABLE "public"."event" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_config" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "primary_color" TEXT NOT NULL DEFAULT '#000000',
    "primary_contrast" TEXT NOT NULL DEFAULT '#000000',
    "secondary_color" TEXT NOT NULL DEFAULT '#000000',
    "secondary_contrast" TEXT NOT NULL DEFAULT '#000000',
    "background_color" TEXT NOT NULL DEFAULT '#000000',
    "background_contrast" TEXT NOT NULL DEFAULT '#000000',
    "text_color_primary" TEXT NOT NULL DEFAULT '#000000',
    "text_color_secondary" TEXT NOT NULL DEFAULT '#000000',
    "welcome_message" TEXT NOT NULL DEFAULT 'Bem-vindo ao nosso evento!',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "event_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "public"."event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_config_event_id_key" ON "public"."event_config"("event_id");

-- AddForeignKey
ALTER TABLE "public"."event" ADD CONSTRAINT "event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_config" ADD CONSTRAINT "event_config_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
