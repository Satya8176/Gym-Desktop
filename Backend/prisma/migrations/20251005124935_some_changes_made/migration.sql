/*
  Warnings:

  - You are about to drop the column `bodyPart` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `description` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipment` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muscleGroup` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setNo` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Exercise" ("id", "name") SELECT "id", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setNo" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL,
    CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("id", "repetitions", "weight", "workoutId") SELECT "id", "repetitions", "weight", "workoutId" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
