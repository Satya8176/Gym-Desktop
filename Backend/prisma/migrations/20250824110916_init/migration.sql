-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guardianName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
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
    "biceps" REAL NOT NULL,
    "thigh" REAL NOT NULL,
    "waist" REAL NOT NULL,
    "medicalConditions" TEXT NOT NULL,
    "disciplineStatus" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idCardUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("enrollmentId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setNumber" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_enrollmentId_key" ON "User"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
