-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isDev" BOOLEAN NOT NULL DEFAULT false,
    "devSecret" TEXT
);
INSERT INTO "new_Owner" ("id", "password", "userName") SELECT "id", "password", "userName" FROM "Owner";
DROP TABLE "Owner";
ALTER TABLE "new_Owner" RENAME TO "Owner";
CREATE UNIQUE INDEX "Owner_userName_key" ON "Owner"("userName");
CREATE UNIQUE INDEX "Owner_password_key" ON "Owner"("password");
CREATE UNIQUE INDEX "Owner_devSecret_key" ON "Owner"("devSecret");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
