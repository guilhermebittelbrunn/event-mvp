/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "plan_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "plan" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);


-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
