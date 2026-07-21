-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "routineId" INTEGER NOT NULL
);
INSERT INTO "new_Day" ("id", "name", "routineId") SELECT "id", "name", "routineId" FROM "Day";
DROP TABLE "Day";
ALTER TABLE "new_Day" RENAME TO "Day";
CREATE TABLE "new_Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "duration" TEXT NOT NULL
);
INSERT INTO "new_Routine" ("duration", "id", "name", "userId") SELECT "duration", "id", "name", "userId" FROM "Routine";
DROP TABLE "Routine";
ALTER TABLE "new_Routine" RENAME TO "Routine";
CREATE TABLE "new_Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setNo" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL
);
INSERT INTO "new_Set" ("id", "repetitions", "setNo", "weight", "workoutId") SELECT "id", "repetitions", "setNo", "weight", "workoutId" FROM "Set";
DROP TABLE "Set";
ALTER TABLE "new_Set" RENAME TO "Set";
CREATE TABLE "new_TemplateDay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "templateId" INTEGER NOT NULL
);
INSERT INTO "new_TemplateDay" ("id", "name", "templateId") SELECT "id", "name", "templateId" FROM "TemplateDay";
DROP TABLE "TemplateDay";
ALTER TABLE "new_TemplateDay" RENAME TO "TemplateDay";
CREATE TABLE "new_TemplateSet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateWorkoutId" INTEGER NOT NULL,
    "setNo" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL
);
INSERT INTO "new_TemplateSet" ("id", "repetitions", "setNo", "templateWorkoutId", "weight") SELECT "id", "repetitions", "setNo", "templateWorkoutId", "weight" FROM "TemplateSet";
DROP TABLE "TemplateSet";
ALTER TABLE "new_TemplateSet" RENAME TO "TemplateSet";
CREATE TABLE "new_TemplateWorkout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateDayId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL
);
INSERT INTO "new_TemplateWorkout" ("exerciseId", "id", "templateDayId") SELECT "exerciseId", "id", "templateDayId" FROM "TemplateWorkout";
DROP TABLE "TemplateWorkout";
ALTER TABLE "new_TemplateWorkout" RENAME TO "TemplateWorkout";
CREATE TABLE "new_Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL
);
INSERT INTO "new_Workout" ("dayId", "exerciseId", "id") SELECT "dayId", "exerciseId", "id" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
