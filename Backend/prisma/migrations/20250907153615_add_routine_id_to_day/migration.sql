/*
  Warnings:

  - You are about to drop the column `splitId` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Day` table. All the data in the column will be lost.
  - Added the required column `routineId` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userSplit" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "routineId" INTEGER NOT NULL,
    CONSTRAINT "Day_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Day" ("id", "name") SELECT "id", "name" FROM "Day";
DROP TABLE "Day";
ALTER TABLE "new_Day" RENAME TO "Day";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
