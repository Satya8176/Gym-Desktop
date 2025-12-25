-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "maxWeight" TEXT NOT NULL,
    "maxReps" TEXT NOT NULL,
    CONSTRAINT "Test_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("exerciseId", "id", "maxReps", "maxWeight", "userId") SELECT "exerciseId", "id", "maxReps", "maxWeight", "userId" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
CREATE UNIQUE INDEX "Test_userId_exerciseId_key" ON "Test"("userId", "exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
