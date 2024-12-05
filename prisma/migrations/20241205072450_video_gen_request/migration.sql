-- CreateTable
CREATE TABLE "VideoGenerationRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "aspectRatio" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL,
    "requestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoGenerationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoGenerationRequest_requestId_key" ON "VideoGenerationRequest"("requestId");
