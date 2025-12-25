/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setNumber" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" INTEGER NOT NULL,
    CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("enrollmentId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("id", "repetitions", "setNumber", "weight", "workoutId") SELECT "id", "repetitions", "setNumber", "weight", "workoutId" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE UNIQUE INDEX "Set_setNumber_workoutId_userId_key" ON "Set"("setNumber", "workoutId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_name_userId_key" ON "Workout"("name", "userId");
