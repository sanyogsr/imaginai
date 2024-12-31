/*
  Warnings:

  - You are about to drop the column `modelName` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `modelUrl` on the `Training` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "modelName",
DROP COLUMN "modelUrl",
ADD COLUMN     "model_id" TEXT,
ADD COLUMN     "model_name" TEXT,
ADD COLUMN     "training_id" TEXT,
ADD COLUMN     "training_steps" INTEGER,
ADD COLUMN     "training_time" TEXT,
ADD COLUMN     "trigger_word" TEXT,
ALTER COLUMN "status" DROP NOT NULL;
