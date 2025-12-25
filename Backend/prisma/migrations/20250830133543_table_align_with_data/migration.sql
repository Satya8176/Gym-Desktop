/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - Added the required column `calf` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guardianName" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "DOB" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsAppNumber" TEXT NOT NULL,
    "dietPreference" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "involvedInSports" BOOLEAN NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "chest" REAL NOT NULL,
    "calf" REAL NOT NULL,
    "biceps" REAL NOT NULL,
    "thigh" REAL NOT NULL,
    "waist" REAL NOT NULL,
    "medicalConditions" TEXT NOT NULL,
    "disciplineStatus" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idCardUrl" TEXT NOT NULL
);
INSERT INTO "new_User" ("DOB", "address", "biceps", "category", "chest", "date", "dietPreference", "disciplineStatus", "email", "enrollmentId", "experienceLevel", "guardianName", "height", "id", "idCardUrl", "involvedInSports", "medicalConditions", "name", "photoUrl", "purpose", "thigh", "waist", "weight", "whatsAppNumber") SELECT "DOB", "address", "biceps", "category", "chest", "date", "dietPreference", "disciplineStatus", "email", "enrollmentId", "experienceLevel", "guardianName", "height", "id", "idCardUrl", "involvedInSports", "medicalConditions", "name", "photoUrl", "purpose", "thigh", "waist", "weight", "whatsAppNumber" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_enrollmentId_key" ON "User"("enrollmentId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
