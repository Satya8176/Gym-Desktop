/*
  Warnings:

  - You are about to drop the column `workoutNumber` on the `Workout` table. All the data in the column will be lost.
  - Added the required column `workoutId` to the `Workout` table without a default value. This is not possible if the table is not empty.

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
    CONSTRAINT "Set_workoutId_userId_fkey" FOREIGN KEY ("workoutId", "userId") REFERENCES "Workout" ("workoutId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Set_userId_fkey" FOREIGN KEY ("userId") REFERENCES "workoutSplit" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Set" ("id", "repetitions", "setNumber", "userId", "weight", "workoutId") SELECT "id", "repetitions", "setNumber", "userId", "weight", "workoutId" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE UNIQUE INDEX "Set_id_key" ON "Set"("id");
CREATE UNIQUE INDEX "Set_setNumber_workoutId_userId_key" ON "Set"("setNumber", "workoutId", "userId");
CREATE TABLE "new_Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workoutId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "workoutSplit" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workout" ("bodyPart", "id", "name", "userId") SELECT "bodyPart", "id", "name", "userId" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
CREATE UNIQUE INDEX "Workout_workoutId_userId_key" ON "Workout"("workoutId", "userId");
CREATE UNIQUE INDEX "Workout_name_userId_key" ON "Workout"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
