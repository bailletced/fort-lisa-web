-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastConnection" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "OperationStore" (
    "operationId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OperationStore_pkey" PRIMARY KEY ("operationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- CreateIndex
CREATE INDEX "OperationStore_operationId_idx" ON "OperationStore"("operationId");
