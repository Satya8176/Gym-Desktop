/*
  Warnings:

  - You are about to drop the `Split` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Split";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "splitId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Day_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userSplit" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Day" ("id", "name", "splitId") SELECT "id", "name", "splitId" FROM "Day";
DROP TABLE "Day";
ALTER TABLE "new_Day" RENAME TO "Day";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
