/*
  Warnings:

  - A unique constraint covering the columns `[userId,exerciseId]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Test_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Test_userId_exerciseId_key" ON "Test"("userId", "exerciseId");
