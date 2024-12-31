/*
  Warnings:

  - The values [STARTED] on the enum `TrainingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrainingStatus_new" AS ENUM ('NULL', 'STARTING', 'PROCESSING', 'CANCELED', 'FAILED', 'SUCCEEDED');
ALTER TABLE "Training" ALTER COLUMN "training_status" TYPE "TrainingStatus_new" USING ("training_status"::text::"TrainingStatus_new");
ALTER TYPE "TrainingStatus" RENAME TO "TrainingStatus_old";
ALTER TYPE "TrainingStatus_new" RENAME TO "TrainingStatus";
DROP TYPE "TrainingStatus_old";
COMMIT;
