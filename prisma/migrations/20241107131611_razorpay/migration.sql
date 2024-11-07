/*
  Warnings:

  - You are about to drop the column `lemonSqueezyId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `lemonSqueezyId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpaySubscriptionId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `razorpayPaymentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpaySubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_lemonSqueezyId_key";

-- DropIndex
DROP INDEX "Subscription_lemonSqueezyId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "lemonSqueezyId",
ADD COLUMN     "razorpayPaymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "lemonSqueezyId",
ADD COLUMN     "razorpaySubscriptionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "currency" SET DEFAULT 'INR';

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "Subscription"("razorpaySubscriptionId");
