-- CreateTable
CREATE TABLE "Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "whatsAppNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT DEFAULT 'Not Mention',
    "age" TEXT,
    "DOB" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "dietPreference" TEXT NOT NULL,
    "involvedInSports" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "chest" TEXT NOT NULL,
    "calf" TEXT NOT NULL,
    "biceps" TEXT NOT NULL,
    "thigh" TEXT NOT NULL,
    "waist" TEXT NOT NULL,
    "medicalConditions" TEXT NOT NULL,
    "disciplineStatus" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "idCardUrl" TEXT NOT NULL,
    "testDone" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "userSplit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "Workout_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Workout_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Set" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setNo" INTEGER NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    "repetitions" INTEGER NOT NULL,
    CONSTRAINT "Set_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Routine" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Routine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userSplit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "routineId" INTEGER NOT NULL,
    CONSTRAINT "Day_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "maxWeight" TEXT NOT NULL,
    "maxReps" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_phNumber_key" ON "Owner"("phNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_password_key" ON "Owner"("password");

-- CreateIndex
CREATE UNIQUE INDEX "User_enrollmentId_key" ON "User"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsAppNumber_key" ON "User"("whatsAppNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userSplit_userId_key" ON "userSplit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Test_userId_key" ON "Test"("userId");
