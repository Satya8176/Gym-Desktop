/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `Test` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "maxWeight" TEXT NOT NULL,
    "maxReps" TEXT NOT NULL
);
INSERT INTO "new_Test" ("id", "maxReps", "maxWeight", "userId") SELECT "id", "maxReps", "maxWeight", "userId" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
CREATE UNIQUE INDEX "Test_userId_key" ON "Test"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
