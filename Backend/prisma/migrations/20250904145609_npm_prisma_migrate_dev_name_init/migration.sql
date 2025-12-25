/*
  Warnings:

  - You are about to drop the `Exercises` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workoutSplit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `setNumber` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `bodyPart` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `workoutId` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `dayId` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exerciseId` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "workoutSplit_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Exercises";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "workoutSplit";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "userSplit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "splitId" INTEGER NOT NULL,
    CONSTRAINT "Day_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Split" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Split_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userSplit" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workoutId" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL,
    CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("id", "repetitions", "weight", "workoutId") SELECT "id", "repetitions", "weight", "workoutId" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE TABLE "new_Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "Workout_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Workout_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workout" ("id") SELECT "id" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "userSplit_userId_key" ON "userSplit"("userId");
