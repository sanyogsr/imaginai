-- CreateTable
CREATE TABLE "Training" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelUrl" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);
