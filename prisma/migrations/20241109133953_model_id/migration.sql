/*
  Warnings:

  - You are about to drop the column `modelId` on the `GeneratedContent` table. All the data in the column will be lost.
  - You are about to drop the `AIModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `model` to the `GeneratedContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GeneratedContent" DROP CONSTRAINT "GeneratedContent_modelId_fkey";

-- AlterTable
ALTER TABLE "GeneratedContent" DROP COLUMN "modelId",
ADD COLUMN     "aIModelId" TEXT,
ADD COLUMN     "model" TEXT NOT NULL;

-- DropTable
DROP TABLE "AIModel";
