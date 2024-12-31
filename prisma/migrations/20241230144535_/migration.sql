/*
  Warnings:

  - You are about to drop the column `status` on the `Training` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('STARTED', 'PROCESSING', 'CANCELED', 'FAILED', 'SUCCEEDED');

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "status",
ADD COLUMN     "training_status" "TrainingStatus";
