/*
  Warnings:

  - You are about to alter the column `userId` on the `Routine` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `name` on the `userSplit` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userSplit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Routine" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
CREATE TABLE "new_userSplit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL
);
INSERT INTO "new_userSplit" ("id", "userId") SELECT "id", "userId" FROM "userSplit";
DROP TABLE "userSplit";
ALTER TABLE "new_userSplit" RENAME TO "userSplit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
