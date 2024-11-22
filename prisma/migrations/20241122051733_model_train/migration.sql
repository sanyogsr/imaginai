/*
  Warnings:

  - Added the required column `modelUrl` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "modelUrl",
ADD COLUMN     "modelUrl" JSONB NOT NULL;
