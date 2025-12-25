-- CreateTable
CREATE TABLE "Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "maxWeight" REAL NOT NULL,
    "maxReps" INTEGER NOT NULL,
    CONSTRAINT "Test_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Test_userId_key" ON "Test"("userId");
